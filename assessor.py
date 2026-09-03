def evaluate_crypto_strength(config: dict):
    vulnerabilities = []
    score = 100

    # Check Encryption Algorithm
    if "CBC" in config.get("encryption", ""):
        vulnerabilities.append({
            "severity": "Medium",
            "title": "CBC Mode Padding Vulnerability Vector",
            "description": "Cipher Block Chaining can expose configurations to oracle padding attacks if integrity validation is weak."
        })
        score -= 15

    # Check DH Group for Forward Secrecy
    dh_group = config.get("dh_group", 14)
    if dh_group < 14:
        vulnerabilities.append({
            "severity": "High",
            "title": "Weak Diffie-Hellman Group",
            "description": f"Group {dh_group} offers insufficient key exchange protection against modern discrete logarithm attacks."
        })
        score -= 30

    # Check PFS Status
    if not config.get("pfs_enabled", True):
        vulnerabilities.append({
            "severity": "High",
            "title": "Perfect Forward Secrecy Disabled",
            "description": "Compromise of long-term secret keys can lead to retro-active decryption of past captured ESP sessions."
        })
        score -= 35

    risk_Level = "Low"
    if score < 50:
        risk_Level = "Critical"
    elif score < 70:
        risk_Level = "High"
    elif score < 85:
        risk_Level = "Medium"

    return {
        "security_score": max(score, 0),
        "risk_level": risk_Level,
        "vulnerabilities": vulnerabilities
    }
  
