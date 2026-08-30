from flask import Flask, jsonify, request
from flask_cors import CORS
from employee_data import depot_employees
import os
import secrets

app = Flask(__name__)

CORS(app)


# =========================================
# TEMPORARY SERVER TOKENS
# =========================================

active_tokens = {}


# =========================================
# HOME
# =========================================

@app.route("/")
def home():
    return "Muster API is running"


# =========================================
# DEPOT LIST
# =========================================

@app.route("/api/depots")
def get_depots():

    return jsonify({
        "success": True,
        "depots": list(depot_employees.keys())
    })


# =========================================
# LOGIN
# =========================================

@app.route("/api/login", methods=["POST"])
def login():

    data = request.get_json(silent=True) or {}

    depot = data.get("depot", "").strip()
    password = data.get("password", "")

    if depot not in depot_employees:

        return jsonify({
            "success": False,
            "message": "Invalid User ID or password."
        }), 401


    passwords = {

        "SMR/KDP": os.environ.get("KDP_PASSWORD", ""),
        "SMR/MUM": os.environ.get("MUM_PASSWORD", "")

    }


    if passwords.get(depot) != password:

        return jsonify({
            "success": False,
            "message": "Invalid User ID or password."
        }), 401


    # Create secure random token

    token = secrets.token_urlsafe(32)

    active_tokens[token] = depot


    return jsonify({
        "success": True,
        "depot": depot,
        "token": token,
        "message": "Login successful"
    })


# =========================================
# EMPLOYEE DATA
# =========================================

@app.route("/api/employees/<path:depot>")
def get_employees(depot):

    # Get authorization header

    auth = request.headers.get("Authorization", "")


    if not auth.startswith("Bearer "):

        return jsonify({
            "success": False,
            "message": "Authentication required."
        }), 401


    token = auth[7:].strip()


    # Check token

    logged_in_depot = active_tokens.get(token)


    if not logged_in_depot:

        return jsonify({
            "success": False,
            "message": "Invalid or expired login."
        }), 401


    # IMPORTANT:
    # Token can access ONLY its own depot

    if logged_in_depot != depot:

        return jsonify({
            "success": False,
            "message": "Access denied."
        }), 403


    return jsonify({
        "success": True,
        "depot": depot,
        "employees": depot_employees[depot]
    })