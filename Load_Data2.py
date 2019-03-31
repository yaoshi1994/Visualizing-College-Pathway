# Import packages
import 	pandas 			as pd
import 	numpy 			as np
# import 	json
# from 	collections 	import defaultdict
from 	functools 		import cmp_to_key

# Define constants
## File related constants
FILE_NAME 				= 'CIS_class_enrollment_20190305.csv'
### COURSE TYPE
LEC 					= 'LEC'
SEM 					= 'SEM'
TA 						= 'TA'
IND 					= 'IND'
### SEMESTER
SPRING 					= 'SP'
SUMMER 					= 'SU'
FALL 					= 'FA'
WINTER 					= 'WI'
### COLUMN NAME
TERM 					= 'TERM'
### CONSTANTS FOR FUNCTIONS
LMBDA 					= 0.5 # This is the value for d function.


def filter_course(df):
	'''
	We will do the filter in two steps.
	First we need to filter these types of courses: 'SEM', 'TA', 'IND'.
	SEM: SEMINAR
	TA: TA COURSES
	IND: INDEPENDENT STUDIES

	Then we need to filter out the complementary course of a lecture with same id
	with the lecture but the type of the complementary course is not a lecture.
	For example: CS 5150 has a complementary discussion.
	'''

	# STEP ONE: filter out seminar, ta, independent study
	df = df[df.SSR_COMPONENT != SEM]
	df = df[df.SSR_COMPONENT != TA]
	df = df[df.SSR_COMPONENT != IND]

	# STEP TWO: filter out all the complementary course
	# first select all the course with lec
	cid_with_lec = set(df[df.SSR_COMPONENT == LEC].COURSE_ID)
	with_lec = df[ df.COURSE_ID.isin( cid_with_lec ) & (df.SSR_COMPONENT == LEC) ]
	
	without_lec = df[ df.COURSE_ID.isin( set(df.COURSE_ID) - cid_with_lec )]
	df = pd.concat((with_lec, without_lec), axis=0)
	return df

## FIND TERMS
def getInfoFromSemester(combo):
	combo = str(combo)
	year = 0
	semester = ""
	for i in range(len(combo)):
		if ord('0') <= ord(combo[i]) <= ord('9'):
			year = year * 10 + ord(combo[i]) - ord('0')
		else:
			semester += combo[i]
	if 		SPRING 	in semester:
		semester 	= 1
	elif 	SUMMER 	in semester:
		semester 	= 2
	elif 	FALL 	in semester:
		semester 	= 3
	elif 	WINTER 	in semester:
		semester 	= 0
	else:
		semester 	= 5
	return year, semester

def sem_comp(combo1, combo2):
	year1, sem1 = getInfoFromSemester(combo1)
	year2, sem2 = getInfoFromSemester(combo2)
	if year1 < year2:
		return -1
	if year1 > year2:
		return 1
	if sem1 < sem2:
		return -1
	if sem1 > sem2:
		return 1
	return 0

def sort_by_semester(df):
	terms = df.TERM.unique().tolist()
	list.sort(terms, key=cmp_to_key(sem_comp))
	df[TERM] = pd.Categorical(df[TERM], terms)
	df = df.sort_values(TERM)
	return df

def student_course_relation(df):
	'''
	This function will be the relation between student to course relation.
	For each row, it represents an unique student.
	For each column, it represents an unique class.
	For this Matrix M, M[r][c] will list as the following:
	If this student did not take this course, then the value M[r][c] will be 0, M[r][c] = 0.
	If this student did take this course in n-th semester, then the value M[r][c] will be n(>0), M[r][c] = n.
	The fully detailed information can be seen in the paper:
	http://ilpubs.stanford.edu:8090/1162/1/coursePrecedence.pdf

	Precondition: The df is already sorted by semester.

	Since we need to define the semester the student take, we first need to find the first semester 
	the student attend the college. The easiest way of thinking it is the semester that the student
	take a course.
	'''

	students = df.STUDENT_ID.unique()
	courses = df.COURSE_ID.unique()
	s = len(students)
	c = len(courses)
	M = np.zeros((s, c))

	for s_idx in range(len(students)):
		# s_idx is the row of the Matrix M.
		df_student = df[df.STUDENT_ID == students[s_idx]]
		curr_semester = df_student.iloc[0].TERM
		sem_idx = 1 # This is the value should be inserted in the Matrix M.
		for course in df_student.COURSE_ID.unique():
			# Get the current row index in df_student
			r_idx = np.where(df_student.COURSE_ID == course)[0][0]
			# Get the semester of this course
			semester = df_student.iloc[r_idx].TERM
			
			if semester != curr_semester:
				# We need to update n-th term to (n+1)-th term
				curr_semester = semester
				sem_idx += 1

			# c_idx is the column of the Matrix M. 
			c_idx = np.where(courses == course)[0]
			M[s_idx][c_idx] = sem_idx
		print(s_idx, len(students))
	return M

def d_funct(val):
	'''
	In the paper, there are two ways of defining function f in 'Graph Projection' Section.
	We are using the second function defined in the paper.
	That is d = lmbda ^ (M_si - M_sj)
	'''
	global lmbda
	if val < 0:
		return 0
	return lmbda ** val

def delta(val):
	'''
	This is the delta function. The type of val is a bool.
	identity(True) = 1; identity(False) = 0
	'''
	if val:
		return 1
	else:
		return 0

def get_P_tilde(s2c):
	'''
	This is the function to get the P_tilde mentioned in the papar.
	P_tilde[i][j] = sum_{students} I(M_si - M_sj >= 0) * I(M_sj > 0) * d(M_si - M_sj)
	'''
	s, c = s2c.shape
	P_tilde = np.zeros((c, c))
	for i in range(c):
		for j in range(c):
			for k in range(s):
				P_tilde[i][j] += delta((s2c[k][i] - s2c[k][j]) >= 0) * delta((s2c[k][j]) > 0) * d_funct(s2c[k][i] - s2c[k][j])

def course_course_relation(s2c):
	'''
	This function will be the relation between course to course relation.
	For each row, it represents the first course.
	For each column, it represents the second course.
	Notice that this matrix is not symmetric.
	For this Matrix P, P[r][c] present the relation from course r to course c:
	The relation is defined in d(M_si - M_sj)

	While first defining P, we need to define P_tilde.
	
	The fully detailed information can be seen in the paper:
	http://ilpubs.stanford.edu:8090/1162/1/coursePrecedence.pdf

	Precondition: The df is already sorted by semester.

	Since we need to define the semester the student take, we first need to find the first semester 
	the student attend the college. The easiest way of thinking it is the semester that the student
	take a course.
	'''

	return None

def construct_relations(df):
	'''
	This function will return a dictionary
	The key of the dictionary will be the major
	The value of the dictionary for each key will be a tuple, which contains two elements
	The first element will be the relation between student to course relation
	The second element will be the relation between courses
	'''
	res = {}
	for major in df.PLAN.unique():
		df_major = df[df.PLAN == major]
		s2c = student_course_relation(df_major)
		c2c = course_course_relation(s2c)
		res[major] = (s2c, c2c)
	return res

def main():
	# Read from file
	df = pd.read_csv(FILE_NAME, encoding='latin-1')
	df = filter_course(df)
	df = sort_by_semester(df)
	relations = construct_relations(df)
	print(df.head(5))

if __name__ == '__main__':
	main()
