from flask import Flask, request, jsonify
from flask_cors import CORS
from email_validator import validate_email, EmailNotValidError
from typing import List, Dict, Any, Optional
import pymysql
from pymysql.cursors import DictCursor
from contextlib import contextmanager
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Database configuration
DB_CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", "sistla10"),
    "database": os.getenv("DB_NAME", "family_budget_tracker"),
    "charset": "utf8mb4",
    "cursorclass": DictCursor,
}

# Database connection context manager
@contextmanager
def get_db_connection():
    connection = pymysql.connect(**DB_CONFIG)
    try:
        yield connection
    finally:
        connection.close()

# Input validation helpers
def validate_registration_data(data: Dict[str, Any]) -> List[str]:
    """Validate registration data and return a list of error messages (empty if valid)"""
    errors = []
    
    # Check if main sections exist
    if 'personalInfo' not in data:
        return ["Missing personal information section"]
    if 'accounts' not in data:
        return ["Missing accounts section"]
    if 'expenses' not in data:
        return ["Missing expenses section"]
    
    # Validate personal info
    personal_info = data['personalInfo']
    required_personal_fields = ['fullName', 'email', 'streetAddress', 'city', 'state', 'zipCode']
    
    for field in required_personal_fields:
        if field not in personal_info or not personal_info[field]:
            errors.append(f"Missing required field: {field}")
    
    # Validate email format
    if 'email' in personal_info and personal_info['email']:
        try:
            validate_email(personal_info['email'])
        except EmailNotValidError:
            errors.append("Invalid email format")
    
    # Validate accounts
    if not data['accounts'] or not isinstance(data['accounts'], list):
        errors.append("At least one account is required")
    else:
        for i, account in enumerate(data['accounts']):
            required_account_fields = ['accountName', 'institutionName', 'accountType', 'lastFourDigits', 'currentBalance']
            for field in required_account_fields:
                if field not in account or not account[field]:
                    errors.append(f"Missing required field in account #{i+1}: {field}")
            
            # Validate last four digits
            if 'lastFourDigits' in account:
                if not account['lastFourDigits'].isdigit() or len(account['lastFourDigits']) != 4:
                    errors.append(f"Last four digits in account #{i+1} must be a 4-digit number")
    
    return errors

# Route for user registration
@app.route("/api/register", methods=["POST"])
def register_user():
    try:
        # Get json data from request
        registration_data = request.json
        
        # Validate input data
        validation_errors = validate_registration_data(registration_data)
        if validation_errors:
            return jsonify({
                "success": False,
                "message": "Validation error",
                "errors": validation_errors
            }), 400
        
        with get_db_connection() as connection:
            with connection.cursor() as cursor:
                # Start transaction
                connection.begin()
                
                try:
                    # Insert personal info into master_profile table
                    personal_info = registration_data['personalInfo']
                    is_earner = personal_info.get('isEarner', True)
                    
                    profile_query = """
                    INSERT INTO master_profile (
                        full_name, email, phone, street_address, city, state, zip_code, 
                        base_salary, is_earner, dependant_of
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """
                    
                    # Handle base salary based on earner status
                    base_salary = None
                    if is_earner and 'baseSalary' in personal_info and personal_info['baseSalary']:
                        base_salary = float(personal_info['baseSalary'])
                    
                    cursor.execute(
                        profile_query,
                        (
                            personal_info['fullName'],
                            personal_info['email'],
                            personal_info.get('phone', None),
                            personal_info['streetAddress'],
                            personal_info['city'],
                            personal_info['state'],
                            personal_info['zipCode'],
                            base_salary,
                            is_earner,
                            personal_info.get('dependantOf', None) if not is_earner else None 
                        )
                    )
                    
                    # Get the profile_id of the inserted record
                    profile_id = connection.insert_id()
                    
                    # Insert bank accounts
                    for account in registration_data['accounts']:
                        account_query = """
                        INSERT INTO bank_accounts (
                            profile_id, account_name, institution_name, account_type, 
                            last_four_digits, current_balance
                        ) VALUES (%s, %s, %s, %s, %s, %s)
                        """
                        
                        cursor.execute(
                            account_query,
                            (
                                profile_id,
                                account['accountName'],
                                account['institutionName'],
                                account['accountType'],
                                account['lastFourDigits'],
                                float(account['currentBalance'])
                            )
                        )
                    
                    # Insert expenses
                    for expense in registration_data['expenses']:
                        # Only insert expenses with an amount
                        if 'amount' in expense and expense['amount'] and float(expense['amount']) > 0:
                            expense_query = """
                            INSERT INTO expenses (
                                profile_id, expense_type, amount, due_date
                            ) VALUES (%s, %s, %s, %s)
                            """
                            
                            cursor.execute(
                                expense_query,
                                (
                                    profile_id,
                                    expense['expenseType'],
                                    float(expense['amount']),
                                    expense.get('dueDate', None)
                                )
                            )
                    
                    # Commit transaction
                    connection.commit()
                    
                    return jsonify({
                        "success": True,
                        "message": "Registration successful",
                        "profile_id": profile_id
                    })
                    
                except Exception as e:
                    # Rollback in case of error
                    connection.rollback()
                    return jsonify({
                        "success": False,
                        "message": f"Database error: {str(e)}"
                    }), 500
                    
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Server error: {str(e)}"
        }), 500

# @app.route("/api/profiles/<id>", methods=["GET"])
# def get_all_profiles(id):
#     try:
#         with get_db_connection() as connection:
#             with connection.cursor() as cursor:
#                 cursor.execute(
#                     """
#                     SELECT 
#                         profile_id as id, 
#                         full_name as name, 
#                         is_earner, 
#                         dependant_of
#                     FROM master_profile
#                     WHERE profile_id = %s
#                     ORDER BY is_earner DESC, full_name ASC
#                     """
#                     , (id,)
#                 )
#                 profiles = cursor.fetchall()
#                 # get all users who are dependants of the dependant_of
#                 if profiles:
#                     dependant_of = profiles[0]['dependant_of']
#                     cursor.execute(
#                         """
#                         SELECT 
#                             profile_id as id, 
#                             full_name as name, 
#                             is_earner, 
#                             dependant_of
#                         FROM master_profile
#                         WHERE dependant_of = %s
#                         ORDER BY is_earner DESC, full_name ASC
#                         """, (dependant_of,)
#                     )
#                     dependants = cursor.fetchall()
#                     profiles.extend(dependants)
                
#                 if not profiles:
#                     return jsonify([]), 200
                
#                 return jsonify(profiles)
                
#     except Exception as e:
#         return jsonify({
#             "success": False,
#             "message": f"Server error: {str(e)}"
#         }), 500
    

@app.route("/api/profiles/<id>", methods=["GET"])
def get_all_profiles(id):
    try:
        with get_db_connection() as connection:
            with connection.cursor() as cursor:
                # First get the requested profile
                cursor.execute(
                    """
                    SELECT 
                        profile_id as id, 
                        full_name as name, 
                        is_earner, 
                        dependant_of
                    FROM master_profile
                    WHERE profile_id = %s
                    """, (id,)
                )
                profile = cursor.fetchone()
                
                if not profile:
                    return jsonify([]), 200
                
                # Initialize the result array
                family_members = []
                
                print(f"Found profile: {profile}")  # Debug info
                
                if profile['is_earner']:
                    # This is a parent/earner - add them to results
                    family_members.append(profile)
                    
                    print(f"Parent name: {profile['name']}")  # Debug info
                    # Get all their dependants - look for profiles where dependant_of equals this parent's name
                    cursor.execute(
                        """
                        SELECT 
                            profile_id as id, 
                            full_name as name, 
                            is_earner, 
                            dependant_of
                        FROM master_profile
                        WHERE dependant_of = %s AND is_earner = 0
                        ORDER BY full_name ASC
                        """, (profile['name'],)  # Use the parent's name, not ID
                    )
                    dependants = cursor.fetchall()
                    print(f"Dependants found: {dependants}")  # Debug info
                    family_members.extend(dependants)
                else:
                    # This is a dependant - get the parent first
                    # Since dependant_of contains the parent's name, look for a profile with that name
                    parent_name = profile['dependant_of']
                    print(f"Looking for parent with name: {parent_name}")  # Debug info
                    
                    cursor.execute(
                        """
                        SELECT 
                            profile_id as id, 
                            full_name as name, 
                            is_earner, 
                            dependant_of
                        FROM master_profile
                        WHERE full_name = %s AND is_earner = 1
                        """, (parent_name,)
                    )
                    parent = cursor.fetchone()
                    print(f"Parent found: {parent}")  # Debug info
                    
                    if parent:
                        family_members.append(parent)
                    
                    # Add the current dependant
                    family_members.append(profile)
                    
                    # Get all siblings (other dependants of the same parent)
                    if parent_name:
                        cursor.execute(
                            """
                            SELECT 
                                profile_id as id, 
                                full_name as name, 
                                is_earner, 
                                dependant_of
                            FROM master_profile
                            WHERE dependant_of = %s AND profile_id != %s AND is_earner = 0
                            ORDER BY full_name ASC
                            """, (parent_name, profile['id'])
                        )
                        siblings = cursor.fetchall()
                        print(f"Siblings found: {siblings}")  # Debug info
                        family_members.extend(siblings)
                
                print(f"Final family members: {family_members}")  # Debug info
                return jsonify(family_members)
                
    except Exception as e:
        print(f"ERROR in get_all_profiles: {str(e)}")  # Debug info
        return jsonify({
            "success": False,
            "message": f"Server error: {str(e)}"
        }), 500
    

@app.route("/api/expenses/<profile_id>", methods=["GET"])
def get_profile_expenses(profile_id):
    try:
        with get_db_connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    SELECT 
                        expense_id,
                        expense_type,
                        amount,
                        due_date
                    FROM expenses
                    WHERE profile_id = %s
                    ORDER BY amount DESC
                    """,
                    (profile_id,)
                )
                expenses = cursor.fetchall()
                
                return jsonify(expenses)
                
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Server error: {str(e)}"
        }), 500
    
@app.route("/api/family-expenses/<profile_id>", methods=["GET"])
def get_family_expenses(profile_id):
    try:
        with get_db_connection() as connection:
            with connection.cursor() as cursor:
                # First, get the profile to verify it's an earner (parent)
                cursor.execute(
                    """
                    SELECT is_earner FROM master_profile 
                    WHERE profile_id = %s
                    """,
                    (profile_id,)
                )
                profile = cursor.fetchone()
                
                if not profile:
                    return jsonify({
                        "success": False,
                        "message": "Profile not found"
                    }), 404
                
                if not profile['is_earner']:
                    return jsonify({
                        "success": False,
                        "message": "Only earners can view family expenses"
                    }), 403
                
                # Get expenses for the parent (earner)
                cursor.execute(
                    """
                    SELECT 
                        expense_id,
                        expense_type,
                        amount,
                        due_date
                    FROM expenses
                    WHERE profile_id = %s
                    """,
                    (profile_id,)
                )
                parent_expenses = cursor.fetchall()
                
                # Get all dependants of this earner
                cursor.execute(
                    """
                    SELECT profile_id
                    FROM master_profile
                    WHERE is_earner = 0 AND dependant_of = %s
                    """,
                    (profile_id,)
                )
                dependants = cursor.fetchall()
                
                # Get expenses for all dependants
                dependant_expenses = []
                for dependant in dependants:
                    cursor.execute(
                        """
                        SELECT 
                            expense_id,
                            expense_type,
                            amount,
                            due_date
                        FROM expenses
                        WHERE profile_id = %s
                        """,
                        (dependant['profile_id'],)
                    )
                    dependant_expenses.extend(cursor.fetchall())
                
                # Combine all expenses
                all_expenses = parent_expenses + dependant_expenses
                
                return jsonify(all_expenses)
                
    except Exception as e:
        print(f"Error fetching family expenses: {str(e)}")
        return jsonify({
            "success": False,
            "message": f"Server error: {str(e)}"
        }), 500
    
# Health check endpoint
@app.route("/health")
def health_check():
    return jsonify({"status": "healthy"})


# Main entry point
if __name__ == "__main__":
    port = int(os.getenv("PORT", 5001))
    app.run(host="0.0.0.0", port=port, debug=True)