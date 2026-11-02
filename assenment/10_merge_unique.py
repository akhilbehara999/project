# Merge two lists, remove duplicates, and sort

def merge_unique(a, b):
    merged = a + b
    result = []
    for x in merged:
        if x not in result:
            result.append(x)
    return sorted(result)

print(merge_unique([3, 1, 4], [2, 3, 5]))
