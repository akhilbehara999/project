# Check if a word reads the same forwards and backwards

def is_palindrome(word):
    word = word.lower()
    rev = ""
    for ch in word:
        rev = ch + rev

    if word == rev:
        return True
    else:
        return False

for w in ["Racecar", "hello", "level"]:
    print(w, is_palindrome(w))
