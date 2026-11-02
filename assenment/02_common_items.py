# Find the items that appear in both lists

def common_items(list1, list2):
    result = []
    for x in list1:
        if x in list2 and x not in result:
            result.append(x)
    return result

print(common_items([1, 2, 3, 4], [3, 4, 5, 6]))
