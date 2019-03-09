from django.db import models
from datetime import date

class Student(models.Model):
    major  = models.CharField(max_length=50)
    netID  = models.CharField(max_length=50, primary_key=True)
    def __str__(self):
        return self.netID

class Pathway(models.Model):
	student     = models.ForeignKey(Student, on_delete=models.CASCADE)
	name        = models.CharField(max_length=50)
	date        = models.DateField("Date Generated", default=date.today)
	category    = models.CharField(max_length=50)
	def __str__(self):
		return self.name