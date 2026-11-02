# Find the most frequent word in a sentence

def most_frequent(sentence):
    counts = {}
    for w in sentence.split():
        if w in counts:
            counts[w] += 1
        else:
            counts[w] = 1

    best = ""
    top = 0
    for w, c in counts.items():
        if c > top:
            top = c
            best = w

    return best, top

print(most_frequent("the quick brown fox jumps over the lazy dog the"))
