from django.db import models


class Major(models.Model):
    major_name = models.CharField(max_length=50)
    major_ID   = models.IntegerField(primary_key=True)


class Student(models.Model):
    major      = models.ForeignKey(Major, on_delete=models.DO_NOTHING)
    student_ID = models.CharField(max_length=50, primary_key=True)

class Course(models.Model):
    course_ID   = models.IntegerField(primary_key=True)
    course_name = models.CharField(max_length=100)


class Transcript(models.Model):
	student  = models.ForeignKey(Student, on_delete=models.DO_NOTHING)
	semester = models.IntegerField()
	course   = models.ForeignKey(Course, on_delete=models.DO_NOTHING)
  