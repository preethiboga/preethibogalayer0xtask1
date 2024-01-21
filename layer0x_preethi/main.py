import statistics

def calculate_statistics(students):
    student_averages = []
    subject_grades = {}
    all_grades = []

    for student in students:
        grades = student["grades"]

        # Calculate average grade for each student
        student_average = sum(grade["grade"] for grade in grades) / len(grades)
        student_averages.append(student_average)

        # Aggregate grades for each subject
        for grade in grades:
            subject = grade["subject"]
            subject_grade = grade["grade"]

            if subject in subject_grades:
                subject_grades[subject].append(subject_grade)
            else:
                subject_grades[subject] = [subject_grade]

            all_grades.append(subject_grade)

    # Calculate overall average grade across all students
    overall_average = sum(student_averages) / len(student_averages)

    # Calculate standard deviation of grades across all students
    overall_std_dev = statistics.stdev(all_grades)

    # Calculate average grade for each subject across all students
    average_subjects = {subject: statistics.mean(grades) for subject, grades in subject_grades.items()}

    return {
        "average_grades": student_averages,
        "average_subjects": average_subjects,
        "overall_average": overall_average,
        "std_deviation": overall_std_dev
    }

# Example usage
students_data=[
{
  "name": "John Doe",
  "grades": [
    {"subject": "Math", "grade": 90},
    {"subject": "English", "grade": 85},
    {"subject": "Science", "grade": 92},
    {"subject": "History", "grade": 88},
    {"subject": "Art", "grade": 95}
  ]
}

]

# students_data = [
#
#     {
#         "name": "John Doe",
#         "grades": [
#             {"subject": "Math", "grade": 90},
#             {"subject": "English", "grade": 85},
#             {"subject": "Science", "grade": 92},
#             {"subject": "History", "grade": 88},
#             {"subject": "Art", "grade": 95}
#         ]
#     },
#     {
#         "name": "Jane Smith",
#         "grades": [
#             {"subject": "Math", "grade": 88},
#             {"subject": "English", "grade": 92},
#             {"subject": "Science", "grade": 87},
#             {"subject": "History", "grade": 90},
#             {"subject": "Art", "grade": 93}
#         ]
#     },
#     {
#         "name": "Bob Johnson",
#         "grades": [
#             {"subject": "Math", "grade": 78},
#             {"subject": "English", "grade": 85},
#             {"subject": "Science", "grade": 80},
#             {"subject": "History", "grade": 88},
#             {"subject": "Art", "grade": 82}
#         ]
#     }
# ]

result = calculate_statistics(students_data)

# Print the results
print("Average Grades:", result["average_grades"])
print("Average Subjects:", result["average_subjects"])
print("Overall Average:", result["overall_average"])
print("Standard Deviation:", result["std_deviation"])
