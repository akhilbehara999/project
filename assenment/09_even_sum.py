# Sum of even numbers from 1 to N, and how many there are

def even_sum(N):
    total = 0
    count = 0
    for i in range(1, N + 1):
        if i % 2 == 0:
            total += i
            count += 1
    return total, count

N = int(input("Enter N: "))
total, count = even_sum(N)
print("Sum of evens:", total)
print("Count of evens:", count)
