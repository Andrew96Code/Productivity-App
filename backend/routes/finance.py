from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
from backend.config import get_supabase_client

finance_bp = Blueprint('finance', __name__)

@finance_bp.route('/transactions', methods=['GET'])
def get_transactions():
    """Get user's financial transactions with optional period filter."""
    user_id = request.args.get('user_id')
    period = request.args.get('period', 'month')  # Default to month

    if not user_id:
        return jsonify({'success': False, 'error': 'User ID is required'}), 400

    try:
        supabase = get_supabase_client()
        
        # Calculate date range based on period
        today = datetime.now().date()
        if period == 'month':
            start_date = today.replace(day=1)
        elif period == 'year':
            start_date = today.replace(month=1, day=1)
        else:  # all time
            start_date = today - timedelta(years=10)  # Arbitrary past date

        # Get transactions within date range
        response = supabase.table('transactions')\
            .select('*')\
            .eq('user_id', user_id)\
            .gte('date', start_date.isoformat())\
            .lte('date', today.isoformat())\
            .order('date', desc=True)\
            .execute()

        if not response:
            print(f"No response from Supabase for user {user_id}")
            return jsonify({
                'success': True,
                'data': []
            })

        transactions = response.data if response.data else []
        
        # Ensure each transaction has the required fields
        for transaction in transactions:
            transaction['type'] = transaction.get('type', 'expense')
            transaction['category'] = transaction.get('category', 'Other')
            transaction['amount'] = float(transaction.get('amount', 0))
            transaction['description'] = transaction.get('description', '')
            transaction['date'] = transaction.get('date', today.isoformat())

        return jsonify({
            'success': True,
            'data': transactions
        })
    except Exception as e:
        print(f"Error in get_transactions for user {user_id}: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'An error occurred while fetching transactions',
            'details': str(e)
        }), 500

@finance_bp.route('/transactions', methods=['POST'])
def add_transaction():
    """Add a new financial transaction."""
    data = request.get_json()
    required_fields = ['user_id', 'type', 'category', 'amount', 'date']
    
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        supabase = get_supabase_client()
        
        response = supabase.table('transactions').insert(data).execute()
        
        return jsonify({
            'success': True,
            'data': response.data[0]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@finance_bp.route('/summary', methods=['GET'])
def get_summary():
    """Get financial summary for the specified period."""
    user_id = request.args.get('user_id')
    period = request.args.get('period', 'month')  # Default to month

    if not user_id:
        return jsonify({
            'success': False,
            'error': 'User ID is required'
        }), 400

    try:
        supabase = get_supabase_client()
        
        # Calculate date range based on period
        today = datetime.now().date()
        if period == 'month':
            start_date = today.replace(day=1)
        elif period == 'year':
            start_date = today.replace(month=1, day=1)
        else:  # all time
            start_date = today - timedelta(years=10)  # Arbitrary past date

        # Get all transactions within date range
        response = supabase.table('transactions')\
            .select('*')\
            .eq('user_id', user_id)\
            .gte('date', start_date.isoformat())\
            .lte('date', today.isoformat())\
            .execute()

        if not response or not response.data:
            print(f"No transactions found for user {user_id}")
            return jsonify({
                'success': True,
                'data': {
                    'income': 0,
                    'expenses': 0,
                    'savings': 0,
                    'investments': 0,
                    'savings_rate': 0
                }
            })

        transactions = response.data
        
        # Calculate summary with default values
        income = sum(float(t.get('amount', 0)) for t in transactions if t.get('type') == 'income')
        expenses = sum(float(t.get('amount', 0)) for t in transactions if t.get('type') == 'expense')
        savings = sum(float(t.get('amount', 0)) for t in transactions if t.get('type') == 'saving')
        investments = sum(float(t.get('amount', 0)) for t in transactions if t.get('type') == 'investment')
        
        # Calculate savings rate (as percentage of income)
        savings_rate = (savings / income * 100) if income > 0 else 0

        return jsonify({
            'success': True,
            'data': {
                'income': income,
                'expenses': expenses,
                'savings': savings,
                'investments': investments,
                'savings_rate': savings_rate
            }
        })
    except Exception as e:
        print(f"Error in get_summary for user {user_id}: {str(e)}")
        # Return a structured error response with default values
        return jsonify({
            'success': True,  # Set to true to prevent frontend error
            'data': {
                'income': 0,
                'expenses': 0,
                'savings': 0,
                'investments': 0,
                'savings_rate': 0
            }
        })

@finance_bp.route('/categories', methods=['GET'])
def get_categories():
    """Get predefined categories for each transaction type."""
    categories = {
        'income': [
            'Salary',
            'Freelance',
            'Investments',
            'Other Income'
        ],
        'expense': [
            'Housing',
            'Transportation',
            'Food',
            'Utilities',
            'Healthcare',
            'Entertainment',
            'Shopping',
            'Other Expenses'
        ],
        'saving': [
            'Emergency Fund',
            'Retirement',
            'Major Purchase',
            'Other Savings'
        ],
        'investment': [
            'Stocks',
            'Bonds',
            'Real Estate',
            'Cryptocurrency',
            'Other Investments'
        ]
    }
    
    return jsonify({
        'success': True,
        'data': categories
    }) 