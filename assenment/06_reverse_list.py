# Reverse a list without using the built-in reverse

def reverse_list(lst):
    if not lst:
        return []
    else:
        rev = []
        for i in range(len(lst) - 1, -1, -1):
            rev.append(lst[i])
        return rev

nums = [1, 2, 3, 4, 5]
print("Original:", nums)
print("Reversed:", reverse_list(nums))

empty = []
print("Empty list reversed:", reverse_list(empty))
