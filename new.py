import base64
import pyscrypt
import os

# Provided SCRYPT configuration
signer_key = base64.b64decode('C9p6bONRROovd42tZDemK3ZtVltXfhQFmE1VQ4DormwvDoc+quefcjYcReCgGIQCKuEIJYbJdjMGnqkqhEiljA==')
salt_separator = base64.b64decode('Bw==')
rounds = 8
mem_cost = 14

# Password to hash
password = "abc"

# Generate a salt (usually should be random for each password)
salt = os.urandom(16)

# Perform the SCRYPT hashing
hashed_password = pyscrypt.hash(password=password.encode('utf-8'),
                                salt=salt,
                                N=2**mem_cost,
                                r=rounds,
                                p=1,
                                dkLen=64)

# Combine salt and hashed password for storage
stored_hash = base64.b64encode(salt + hashed_password).decode('utf-8')

print("Stored Hash:", stored_hash)
