# IMPORT PACKAGES
import pandas as pd
import numpy as np
from collections import defaultdict
import json

# DEFINE CONSTANTS
STUDENT_ID 		= 'emplid_anon'
MAJOR			= 'plan'
TERM			= 'strm'
COURSE_NAME		= 'course'
COURSE_ID		= 'course_id'
THRESHOLD		= 0.5
SOURCE			= 'source'
TARGET			= 'target'
WEIGHT 			= 'weight'
ID 				= 'id'
NODES 			= 'nodes'
LINKS 			= 'links'
DATA_FILE 		= 'pathway_viz_example.csv'
SPLITTER 		= '-'
MAX_TERM_DIST	= 1

# DEFINE CLASSES
## DEFINE MAJOR
class Major:
	counter			= 0
	def __init__(self, m_name):
		self.m_id 	= Major.counter
		self.m_name 	= m_name
		Major.counter	= Major.counter + 1

## DEFINE STUDENT
class Student:
	def __init__(self, s_id, m_id):
		self.s_id 	= s_id
		self.m_id 	= m_id

## DEFINE COURSE
class Course:
	def __init__(self, c_id, c_name):
		self.c_id 	= c_id
		self.c_name 	= c_name

## DEFINE TRANSCRIPT
class Transcript:
	def __init__(self, s_id, s_term, c_id):
		self.s_id 	= s_id
		self.s_term 	= s_term
		self.c_id 	= c_id

# DEINE SETS
students 			= {} # KEY IS STUDNET ID
majors 				= {} # KEY IS MAJOR ID
majors_rev			= {} # KEY IS MAJOR NAME
courses 			= {} # KEY IS COURSE ID
transcripts 		= defaultdict(lambda: defaultdict(dict)) # FIRST KEY IS MAJOR SECOND KEY IS STUDENT ID

# DEFINE FUNCTIONS
def update_major(m_name):
	global majors, majors_rev
	if m_name not in majors_rev:
		m = Major(m_name)
		majors_rev[m_name] = m
		majors[m.m_id] = m

def update_student(s_id, m_name):
	global students, majors_rev
	if m_name not in majors_rev:
		update_major(m_name)
	if s_id not in students:
		s = Student(s_id, majors_rev[m_name].m_id)
		students[s_id] = s

def update_course(c_id, c_name):
	global courses
	if c_id not in courses:
		c = Course(c_id, c_name)
		courses[c_id] = c

def update_transcript(s_id, m_name, s_term, c_id, c_name):
	global students, courses, majors_rev, transcripts
	if m_name not in majors_rev:
		update_major(m_name)
	if s_id not in students:
		update_student(s_id, m_name)
	if c_id not in courses:
		update_course(c_id, c_name)
	m_id = majors_rev[m_name].m_id
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
	c_name = data[COURSE_NAME]
	c_id = data[COURSE_ID]
	update_major(m_name)
	update_student(s_id, m_name)
	update_course(c_id, c_name)
	update_transcript(s_id, m_name, s_term, c_id, c_name)

# LOAD DATA
df 	= pd.read_csv(DATA_FILE)
N, _ 	= df.shape

# STORE DATA INTO SETS
for i in range(N):
	data = df.loc[i]
	update(data)

# print("students:", len(students))
# print("majors:", len(majors))
# print("courses:", len(courses))
# print("semesters:", df.strm.unique())

# WE NEED TO DEFINE THE EDGE BETWEEN TWO NODES FOR EACH MAJOR
## FIND TERMS
terms = np.sort(df.strm.unique())

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
	i1 = np.where(terms == course_1.s_term)[0] # GET INDEX OF TERM_1
	i2 = np.where(terms == course_2.s_term)[0] # GET INDEX OF TERM_2
	key_relation, reverse = getKeyRelation(course_1, course_2)
	idx = getIndex(i1, i2, reverse)
	if key_relation not in course_relation[m_id]:
		course_relation[m_id][key_relation] = [0,0,0,0]
	course_relation[m_id][key_relation][idx] += 1

for m_id in transcripts:
	course_relation[m_id] = {}
	course_size[m_id] = {}
	for s_id in transcripts[m_id]:
		for t1 in transcripts[m_id][s_id]: # term_1
			for c1 in range(len(transcripts[m_id][s_id][t1])): # course_1 in term_1
				course_1 = transcripts[m_id][s_id][t1][c1]
				if course_1.c_id not in course_size[m_id]:
					course_size[m_id][course_1.c_id] = 0
				course_size[m_id][course_1.c_id] += 1
				for t2 in transcripts[m_id][s_id]: # term_2
					for c2 in range(len(transcripts[m_id][s_id][t2])): # course_2 in term_2
						course_2 = transcripts[m_id][s_id][t2][c2]
						if c1 == c2 and t1 == t2:
							continue
						update_course_relation(course_1, course_2, m_id)
						

### DEFINE NODES
nodes = {}
for m in course_size:
	nodes[m] = []
	total_cnt = 0
	for c in course_size[m]:
		total_cnt += course_size[m][c]
	for c in course_size[m]:
		weight = course_size[m][c] / total_cnt
		nodes[m].append({ID: courses[c].c_name, WEIGHT: weight})

### DEFINE EDGES
links = {}
for m in course_relation:
	links[m] = []
	for cc in course_relation[m]:
		reverse = False
		if course_relation[m][cc][1] < course_relation[m][cc][2]:
			reverse = True
		total_sum = sum(course_relation[m][cc])
		if reverse:
			edge_sum = course_relation[m][cc][0] + course_relation[m][cc][2]
		else:
			edge_sum = course_relation[m][cc][0] + course_relation[m][cc][1]
		weight = edge_sum / total_sum
		if weight < THRESHOLD:
			continue
		ccs = cc.split(SPLITTER)
		if reverse:
			src = int(ccs[1])
			trg = int(ccs[0])
		else:
			src = int(ccs[0])
			trg = int(ccs[1])
		links[m].append({SOURCE: courses[src].c_name, TARGET: courses[trg].c_name, WEIGHT: weight})

for m in nodes:
	m_name = majors[m].m_name
	data = {NODES: nodes[m], LINKS: links[m]}
	with open(m_name + '.json', 'w') as f:
		json.dump(data, f)
	