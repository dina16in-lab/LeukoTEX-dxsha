import argparse
import getpass
import re
import sys
from app.database import engine, Base, SessionLocal
from app.models.user import User
from app.core.security import get_password_hash


def validate_email(email: str) -> bool:
    pattern = r"^[^\s@]+@[^\s@]+\.[^\s@]+$"
    return bool(re.match(pattern, email))


def create_admin(name: str = None, email: str = None, password: str = None):
    # Ensure database schema is created
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Prompt interactively if not provided via arguments
        if not name:
            name = input("Enter Admin Username/Name: ").strip()
            while not name or len(name) < 2:
                print("Error: Name must be at least 2 characters.")
                name = input("Enter Admin Username/Name: ").strip()

        if not email:
            email = input("Enter Admin Email: ").strip()
            while not validate_email(email):
                print("Error: Please enter a valid email address.")
                email = input("Enter Admin Email: ").strip()
        else:
            if not validate_email(email):
                print(f"Error: Invalid email format '{email}'")
                return False

        email = email.lower().strip()

        # Check existing user
        existing_email = db.query(User).filter(User.email == email).first()
        if existing_email:
            print(f"Notice: An admin account with email '{email}' already exists (User ID: {existing_email.id}). No duplicate created.")
            return False

        existing_name = db.query(User).filter(User.username == name).first()
        if existing_name:
            print(f"Notice: An admin account with username '{name}' already exists. Please choose a different username.")
            return False

        if not password:
            password = getpass.getpass("Enter Admin Password: ")
            while len(password) < 6:
                print("Error: Password must be at least 6 characters.")
                password = getpass.getpass("Enter Admin Password: ")
            
            password_confirm = getpass.getpass("Confirm Admin Password: ")
            while password != password_confirm:
                print("Error: Passwords do not match.")
                password = getpass.getpass("Enter Admin Password: ")
                password_confirm = getpass.getpass("Confirm Admin Password: ")
        else:
            if len(password) < 6:
                print("Error: Password must be at least 6 characters.")
                return False

        # Hash password and persist user
        hashed_password = get_password_hash(password)
        admin_user = User(
            username=name,
            email=email,
            hashed_password=hashed_password,
            is_admin=True,
            is_active=True
        )
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)

        print("==================================================")
        print("SUCCESS: Admin account created securely.")
        print(f"  User ID   : {admin_user.id}")
        print(f"  Username  : {admin_user.username}")
        print(f"  Email     : {admin_user.email}")
        print(f"  Role      : Administrator")
        print("==================================================")
        return True

    except Exception as e:
        db.rollback()
        print(f"Error creating admin account: {e}", file=sys.stderr)
        return False
    finally:
        db.close()


def main():
    parser = argparse.ArgumentParser(description="Securely create an administrator account for LEUKOTEX.")
    parser.add_argument("--name", "-n", type=str, help="Admin username/name", default=None)
    parser.add_argument("--email", "-e", type=str, help="Admin email address", default=None)
    parser.add_argument("--password", "-p", type=str, help="Admin password", default=None)

    args = parser.parse_args()
    success = create_admin(name=args.name, email=args.email, password=args.password)
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
