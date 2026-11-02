# Average of marks plus a letter grade

def score_grade(marks):
    total = 0
    for m in marks:
        total += m
    avg = total / len(marks)

    if avg >= 90:
        grade = "A"
    elif avg >= 80:
        grade = "B"
    elif avg >= 70:
        grade = "C"
    elif avg >= 60:
        grade = "D"
    else:
        grade = "F"

    return avg, grade

marks = [85, 92, 78]
avg, grade = score_grade(marks)
print("Average:", avg)
print("Grade:", grade)
