#!/bin/sh

# ======================================================================
# API User Import Script
#
# Before running, you must set these environment variables in your shell.
# Example: export MGMT_API_ACCESS_TOKEN="your_token_here"
# ======================================================================

# Check if all required environment variables are set
if [ -z "AUTH0_DOMAIN" ] || [ -z "$MGMT_API_ACCESS_TOKEN" ] || [ -z "$USERS_IMPORT_FILE" ] || [ -z "$CONNECTION_ID" ]; then
    echo "Error: One or more required environment variables are not set."
    echo "Please set:"
    echo "  - AUTH0_DOMAIN"
    echo "  - MGMT_API_ACCESS_TOKEN"
    echo "  - USERS_IMPORT_FILE (path to your JSON file, e.g., users.json)"
    echo "  - CONNECTION_ID"
    exit 1
fi

echo "Starting user import..."
echo "Using file: $USERS_IMPORT_FILE"

# The curl command to import users, using the environment variables
curl --request POST \
  --url "https://$AUTH0_DOMAIN/api/v2/jobs/users-imports" \
  --header "authorization: Bearer $MGMT_API_ACCESS_TOKEN" \
  --form "users=@$USERS_IMPORT_FILE" \
  --form "connection_id=$CONNECTION_ID" 

echo "Import command sent. Check Auth0 dashboard for job status."
