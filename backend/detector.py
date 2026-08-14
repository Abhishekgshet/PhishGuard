def analyze_url(url):

    score = 0
    warnings = []

    # Check HTTPS
    if not url.startswith("https://"):
        score += 20
        warnings.append("URL does not use HTTPS")

    # Check @ symbol
    if "@" in url:
        score += 20
        warnings.append("URL contains @ symbol")

    # Check URL length
    if len(url) > 75:
        score += 10
        warnings.append("URL is unusually long")

    # Check IP address
    parts = url.split("/")

    if len(parts) > 2:

        domain = parts[2]

        domain_parts = domain.split(".")

        if len(domain_parts) == 4:

            if all(part.isdigit() for part in domain_parts):

                score += 30

                warnings.append(
                    "URL uses an IP address"
                )

    # Check suspicious words
    suspicious_words = [
        "login",
        "verify",
        "password",
        "account",
        "bank"
    ]

    for word in suspicious_words:

        if word in url.lower():

            score += 10

            warnings.append(
                "Suspicious keyword found: " + word
            )

            break

    # Limit score to 100
    if score > 100:
        score = 100

    # Determine status
    if score >= 50:

        status = "High Risk"

    elif score >= 20:

        status = "Suspicious"

    else:

        status = "Low Risk"

    return {
        "risk_score": score,
        "status": status,
        "warnings": warnings
    }