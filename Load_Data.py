# IMPORT PACKAGES
import pandas as pd
import numpy as np
import json
from collections import defaultdict
from functools import cmp_to_key

# DEFINE CONSTANTS
STUDENT_ID 					= 'STUDENT_ID' 							# UNIQUE IDENTIFY STUDENT
MAJOR						= 'PLAN'								# FULL NAME OF MAJOR
TERM						= 'TERM'								# SEMESTER
COURSE_COMBO				= 'CATALOG_NAME'						# COURSE NUMBER COMBO, I.E. CS5150
COURSE_NAME 				= 'CLASS_DESCR'							# COURSE NAME, I.E. SOFTWARE ENGINEERING
COURSE_ID					= 'COURSE_ID'							# COURSE ID THAT IDENTIFY THE COURSE NUMBER
COURSE_TYPE 				= 'SSR_COMPONENT'						# COURSE TYPE
EDGE_THRESHOLD				= 0.5									# COURSE RELATION THRESHOLD, IT SHOULD BETWEEN 0-1
NODE_THRESHOLD				= 0.05									# COURSE THRESHOLD, IT SHOULD BETWEEN 0-1
SOURCE						= 'source'
TARGET						= 'target'
WEIGHT 						= 'weight'
ID 							= 'id'
NODES 						= 'nodes'
LINKS 						= 'links'
DATA_FILE 					= 'CIS_class_enrollment_20190305.csv'	# THE FILE WE NEED TO READ
SPLITTER 					= '-'
SLASH						= '/'
MAX_TERM_DIST				= 2										# THE MAX DISTANCE BETWEEN TWO TERMS
SPRING						= 'SP'
SUMMER						= 'SU'
FALL						= 'FA'
WINTER						= 'WI'
LEC 						= 'LEC'

# DEFINE CLASSES
## DEFINE MAJOR
class Major:
	counter					= 0
	def __init__(self, m_name):
		self.m_id 			= Major.counter
		self.m_name 		= m_name
		self.student_cnt	= 0
		Major.counter		= Major.counter + 1

## DEFINE STUDENT
class Student:
	def __init__(self, s_id, m_id):
		self.s_id 			= s_id
		self.m_id 			= m_id

## DEFINE COURSE
class Course:
	def __init__(self, c_id, c_combo, c_name, c_type):
		self.c_id 			= c_id
		self.c_combo_list	= {c_combo}
		self.c_type 		= c_type
		self.c_name_list 	= {c_name}

## DEFINE TRANSCRIPT
class Transcript:
	def __init__(self, s_id, s_term, c_id):
		self.s_id 			= s_id
		self.s_term 		= s_term
		self.c_id 			= c_id

# DEINE SETS
students 					= {} # KEY IS STUDNET ID
majors 						= {} # KEY IS MAJOR ID
majors_rev					= {} # KEY IS MAJOR NAME
courses 					= {} # KEY IS COURSE ID
transcripts 				= defaultdict(lambda: defaultdict(dict)) 
# FIRST KEY IS MAJOR SECOND KEY IS STUDENT ID

# DEFINE FUNCTIONS
def update_major(m_name, update_cnt=False):
	global majors, majors_rev
	if m_name not in majors_rev:
		m 					= Major(m_name)
		majors_rev[m_name] 	= m
		majors[m.m_id] 		= m
	elif update_cnt:
		majors_rev[m_name].student_cnt	+= 1 

def update_student(s_id, m_name):
	global students, majors_rev
	if s_id not in students:
		s 					= Student(s_id, majors_rev[m_name].m_id)
		students[s_id] 		= s
		update_major(m_name, update_cnt=True)

def update_course(c_id, c_combo, c_name, c_type):
	global courses
	if c_id not in courses:
		c 					= Course(c_id, c_combo, c_name, c_type)
		courses[c_id] 		= c
	else:
		if c_combo not in courses[c_id].c_combo_list:
			courses[c_id].c_combo_list.add(c_combo)
		if c_name not in courses[c_id].c_name_list:
			courses[c_id].c_name_list.add(c_name)
		if courses[c_id].c_type != LEC:
			courses[c_id].c_type = c_type

def update_transcript(s_id, m_name, s_term, c_id, c_name, c_type):
	global students, courses, majors_rev, transcripts
	m_id = majors_rev[m_name].m_id
	if c_type != LEC:
		return
	if m_id not in transcripts:
		transcripts[m_id] = defaultdict(dict)
	if s_id not in transcripts[m_id]:
		transcripts[m_id][s_id] = {}
	if s_term not in transcripts[m_id][s_id]:
		transcripts[m_id][s_id][s_term] = []
	transcripts[m_id][s_id][s_term].append(Transcript(s_id, s_term, c_id))

def update(data):
	s_id = data[STUDENT_ID]
	m_name = data[MAJOR]
	s_term = data[TERM]
	c_name = data[COURSE_COMBO]
	c_id = data[COURSE_ID]
	c_combo = data[COURSE_COMBO]
	c_type = data[COURSE_TYPE]
	update_major(m_name)
	update_student(s_id, m_name)
	update_course(c_id, c_combo, c_name, c_type)
	update_transcript(s_id, m_name, s_term, c_id, c_name, c_type)

# LOAD DATA
df 	= pd.read_csv(DATA_FILE, encoding='latin-1')
N, _ 	= df.shape
# STORE DATA INTO SETS
for i in range(N):
	if i % 1000 == 0 and __debug__:
		print(i)
	data = df.loc[i]
	update(data)

# print("students:", len(students))
# print("majors:", len(majors))
# print("courses:", len(courses))
# print("semesters:", df.strm.unique())

# WE NEED TO DEFINE THE EDGE BETWEEN TWO NODES FOR EACH MAJOR
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

terms = df.TERM.unique().tolist()
list.sort(terms, key=cmp_to_key(sem_comp))
course_relation = defaultdict(dict)
course_size = defaultdict(dict)

## DEFINE RELATIONS BETWEEN TWO CLASSES
### IF TWO COURSES ARE IN THE SAME SEMESTER, PUT INDEX 0
### IF THE COURSE WITH LOWER ID IS THE PREVIOUS SEMESTER
### PUT INDEX 1. IF THE COURSE WITH HIGHER ID IS THE PR-
### EVIOUS SEMESTER, PUT INDEX 2. PUT INDEX 3, OTHERWISE.
### THE KEY IS DEFINED AS LOWER_COURSE_ID-HIGHER_COURSE_
### ID AND THE VALUE OF IT IS THE ARRAY.
def getKeyRelation(course_1, course_2):
	s_c1_id = str(course_1.c_id)
	s_c2_id = str(course_2.c_id)
	if s_c1_id > s_c2_id:
		return s_c2_id + SPLITTER + s_c1_id, True
	else:
		return s_c1_id + SPLITTER + s_c2_id, False

def getIndex(term_1, term_2, reverse):
	if reverse:
		term_1, term_2 = term_2, term_1
	if term_1 == term_2:
		idx = 0
	elif term_1 + MAX_TERM_DIST >= term_2 > term_1:
		idx = 1
	elif term_2 < term_1 <= term_2 + MAX_TERM_DIST:
		idx = 2
	else:
		idx = 3
	return idx

def update_course_relation(course_1, course_2, m_id):
	i1 = terms.index(course_1.s_term) # GET INDEX OF TERM_1
	i2 = terms.index(course_2.s_term) # GET INDEX OF TERM_2
	key_relation, reverse = getKeyRelation(course_1, course_2)
	idx = getIndex(i1, i2, reverse)
	if key_relation not in course_relation[m_id]:
		course_relation[m_id][key_relation] = [0,0,0,0]
	course_relation[m_id][key_relation][idx] += 1

for m_id in transcripts:
	course_relation[m_id] = {}
	course_size[m_id] = {}
	cnt = 0
	for s_id in transcripts[m_id]:
		cnt += 1
		if cnt % 50 == 0:
			print(cnt)
		for t1 in transcripts[m_id][s_id]: # term_1
			for c1 in range(len(transcripts[m_id][s_id][t1])): # course_1 in term_1
				course_1 = transcripts[m_id][s_id][t1][c1]
				if course_1.c_id not in course_size[m_id]:
					course_size[m_id][course_1.c_id] = 0
				course_size[m_id][course_1.c_id] += 1
				for c2 in range(c1 + 1, len(transcripts[m_id][s_id][t1])):
					course_2 = transcripts[m_id][s_id][t1][c2]
					update_course_relation(course_1, course_2, m_id)
				for t2 in transcripts[m_id][s_id]: # term_2
					if t2 <= t1:
						continue
					for c2 in range(len(transcripts[m_id][s_id][t2])): # course_2 in term_2
						course_2 = transcripts[m_id][s_id][t2][c2]
						update_course_relation(course_1, course_2, m_id)

def getCombo(c):
	c_combo = ""
	for combo in c.c_combo_list:
		c_combo += combo + SLASH
	return c_combo[:-1]

### DEFINE NODES
nodes = {}
valid_course = defaultdict(set)
for m in course_size:
	nodes[m] = []
	total_cnt = 0
	for c in course_size[m]:
		weight = course_size[m][c] / majors[m].student_cnt
		if weight < NODE_THRESHOLD:
			continue
		nodes[m].append({ID: getCombo(courses[c]), WEIGHT: weight})
		valid_course[m].add(int(courses[c].c_id))

def course_size_not_enough(c2c, m):
	c2cs = c2c.split(SPLITTER)
	if int(c2cs[0]) not in valid_course[m] or int(c2cs[1]) not in valid_course[m]:
		return True
	return False


### DEFINE EDGES
links = {}
for m in course_relation:
	links[m] = []
	for c2c in course_relation[m]:
		reverse = False
		if course_relation[m][c2c][1] < course_relation[m][c2c][2]:
			reverse = True
		total_sum = sum(course_relation[m][c2c])
		if course_size_not_enough(c2c, m):
			continue
		if reverse:
			edge_sum = course_relation[m][c2c][0] + course_relation[m][c2c][2]
		else:
			edge_sum = course_relation[m][c2c][0] + course_relation[m][c2c][1]
		weight = edge_sum / total_sum
		if weight < EDGE_THRESHOLD:
			continue
		c2cs = c2c.split(SPLITTER)
		if reverse:
			src = int(c2cs[1])
			trg = int(c2cs[0])
		else:
			src = int(c2cs[0])
			trg = int(c2cs[1])
		links[m].append({SOURCE: getCombo(courses[src]), TARGET: getCombo(courses[trg]), WEIGHT: weight})

for m in nodes:
	m_name = majors[m].m_name
	data = {NODES: nodes[m], LINKS: links[m]}
	with open(m_name + '.json', 'w') as f:
		json.dump(data, f)
	