# IMPORT PACKAGES
import pandas as pd
import numpy as np
from collections import defaultdict
import json

# DEFINE CONSTANTS
STUDENT_ID 	= 'emplid_anon'
MAJOR		= 'plan'
TERM		= 'strm'
COURSE_NAME	= 'course'
COURSE_ID	= 'course_id'
THRESHOLD	= 0.5
SOURCE		= 'source'
TARGET		= 'target'
WEIGHT 		= 'weight'
ID 			= 'id'
NODES 		= 'nodes'
LINKS 		= 'links'

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
students 		= {} # KEY IS STUDNET ID
majors 			= {} # KEY IS MAJOR ID
majors_rev		= {} # KEY IS MAJOR NAME
courses 		= {} # KEY IS COURSE ID
transcripts 	= defaultdict(dict) # KEY IS STUDENT ID

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
	if s_id not in transcripts:
		transcripts[s_id] = {}
	if s_term not in transcripts[s_id]:
		transcripts[s_id][s_term] = []
	transcripts[s_id][s_term].append(Transcript(s_id, s_term, c_id))

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
df 	= pd.read_csv('pathway_viz_example.csv')
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
## TRANSCRIPT SPLIT BY MAJOR
transcript_major = defaultdict(lambda: defaultdict(dict))
for m in majors:
	transcript_major[m] = defaultdict(dict)
for s_id in transcripts:
	transcript_major[students[s_id].m_id][s_id] = transcripts[s_id]

## FIND TERMS
terms = np.sort(df.strm.unique())

## DEFINE RELATIONS BETWEEN TWO CLASSES
### IF TWO COURSES ARE IN THE SAME SEMESTER, PUT INDEX 0
### IF THE COURSE WITH LOWER ID IS THE PREVIOUS SEMESTER
### PUT INDEX 1. IF THE COURSE WITH HIGHER ID IS THE PR-
### EVIOUS SEMESTER, PUT INDEX 2. PUT INDEX 3, OTHERWISE.
### THE KEY IS DEFINED AS LOWER_COURSE_ID-HIGHER_COURSE_
### ID AND THE VALUE OF IT IS THE ARRAY.
course_relation = defaultdict(dict)
course_size = defaultdict(dict)
for m in transcript_major:
	course_relation[m] = {}
	course_size[m] = {}
	# cnt = 0
	for s_id in transcript_major[m]:
		# cnt += 1
		# if cnt % 10 == 1:
		# 	print(cnt)
		for t1 in transcript_major[m][s_id]:
			for c1 in range(len(transcript_major[m][s_id][t1])):
				if transcript_major[m][s_id][t1][c1].c_id not in course_size[m]:
					course_size[m][transcript_major[m][s_id][t1][c1].c_id] = 0
				course_size[m][transcript_major[m][s_id][t1][c1].c_id] += 1
				for t2 in transcript_major[m][s_id]:
					for c2 in range(len(transcript_major[m][s_id][t2])):
						if c1 == c2 and t1 == t2:
							continue
						i1 = np.where(terms == transcript_major[m][s_id][t1][c1].s_term)[0]
						i2 = np.where(terms == transcript_major[m][s_id][t2][c2].s_term)[0]
						c_id1 = transcript_major[m][s_id][t1][c1].c_id
						c_id2 = transcript_major[m][s_id][t2][c2].c_id
						flag = False
						if c1 > c2:
							flag = True
						if i1 == i2:
							idx = 0
						elif (i2 == i1 + 1 and flag) or (i1 == i2 + 1 and not flag):
							idx = 1
						elif (i1 == i2 + 1 and flag) or (i2 == i1 + 1 and not flag):
							idx = 2
						else:
							idx = 3
						if not flag:
							string = str(c_id1) + '-' + str(c_id2)
						else:
							string = str(c_id2) + '-' + str(c_id1)
						if string not in course_relation[m]:
							course_relation[m][string] = [0,0,0,0]
						course_relation[m][string][idx] += 1
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
		ccs = cc.split("-")
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
	