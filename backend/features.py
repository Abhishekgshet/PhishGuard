from urllib.parse import urlparse
import re


def extract_features(url):

    parsed = urlparse(url)

    hostname = parsed.netloc
    path = parsed.path

    features = {}

    features["url_length"] = len(url)

    features["hostname_length"] = len(hostname)

    features["path_length"] = len(path)

    features["dot_count"] = url.count(".")

    features["hyphen_count"] = url.count("-")

    features["slash_count"] = url.count("/")

    features["question_mark_count"] = url.count("?")

    features["equal_count"] = url.count("=")

    features["ampersand_count"] = url.count("&")

    features["at_symbol_count"] = url.count("@")

    features["digit_count"] = sum(
        char.isdigit() for char in url
    )

    features["letter_count"] = sum(
        char.isalpha() for char in url
    )

    features["special_character_count"] = sum(
        not char.isalnum() and char not in "/:.-"
        for char in url
    )

    features["has_https"] = 1 if parsed.scheme == "https" else 0

    features["has_ip_address"] = 1 if re.match(
        r"^\d+\.\d+\.\d+\.\d+$",
        hostname
    ) else 0

    features["has_at_symbol"] = 1 if "@" in url else 0

    features["subdomain_count"] = max(
        0,
        len(hostname.split(".")) - 2
    )

    features["has_port"] = 1 if parsed.port else 0

    features["path_depth"] = len(
        [part for part in path.split("/") if part]
    )

    suspicious_words = [
        "login",
        "verify",
        "account",
        "update",
        "secure",
        "bank",
        "password",
        "confirm",
        "signin",
        "payment"
    ]

    lower_url = url.lower()

    features["suspicious_word_count"] = sum(
        1 for word in suspicious_words
        if word in lower_url
    )

    return features


if __name__ == "__main__":

    url = "https://google.com"

    print(extract_features(url))