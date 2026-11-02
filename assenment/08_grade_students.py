# Grade a whole class: list of (name, marks) tuples -> list of dicts

def grade_students(classlist):
    results = []
    for name, marks in classlist:
        total = 0
        for m in marks:
            total += m
        avg = total / len(marks)

        if avg >= 60:
            passed = True
        else:
            passed = False

        results.append({"name": name, "average": avg, "passed": passed})
    return results

students = [("Anna", [85, 92, 78]), ("Bob", [50, 55, 48])]
for r in grade_students(students):
    print(r)
