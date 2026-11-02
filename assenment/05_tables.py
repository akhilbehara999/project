# Print multiplication tables from 1 up to a number

def tables(upto):
    for i in range(1, upto + 1):
        for j in range(1, 11):
            print(i, "x", j, "=", i * j)
        if i != upto:
            print()   # empty line between tables (not after the last)

tables(3)
