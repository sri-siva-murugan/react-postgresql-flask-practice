from flask import Flask, render_template, request, flash, current_app
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
app = Flask(__name__)
# with app.app_context():
#     # within this block, current_app points to app.
    # print current_app.get_cu
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:postgresql@localhost/studentDB'
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
# app.secret_key = 'secret string'
db = SQLAlchemy(app)
CORS(app)

class Students(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sname = db.Column(db.String(80), unique=True, nullable=False)
    branch = db.Column(db.String(80), nullable=False)
    college = db.Column(db.String(80), nullable=False)

    # def __repr__(self):
    #     return f"students: {self.sname}"

    def __init__(self, sname, branch, college):
        self.sname = sname
        self.branch = branch
        self.college = college

def format_student(student):
    return { "Id": student.id,
        "Name": student.sname,
            "Branch": student.branch,
            "College": student.college
    }
@app.route('/')
def home():
    return '<a href="/studentadd"><button> Click here </button></a>'


@app.route("/addstudent")
def addstudent():
    return render_template("index.html")


@app.route("/studentadd", methods=['POST'])
def studentadd():
    sname = request.json["sname"]
    branch = request.json["branch"]
    college = request.json["college"]
    entry = Students(sname, branch, college)
    db.session.add(entry)
    # student = Students.query.filter_by(sname=sname).one()
    # student.update(dict(sname=sname, branch=branch, college=college))
    db.session.commit()
    return format_student(entry)
    # return render_template("index.html")

@app.route("/getstudentslist", methods=["GET"])
def listStudents():
    students = Students.query.order_by(Students.id.asc()).all()
    studentList = []
    for student in students:
        studentList.append(format_student(student))
    # print(studentList)
    return studentList
    # return render_template("index.html")

@app.route("/getstudent/<name>", methods=["GET"])
def getStudent(name):
    student = Students.query.filter_by(sname=name).one()
    formatted_student = format_student(student)
    print(formatted_student)
    return formatted_student
    # return render_template("index.html")

@app.route("/deleteStudent/<id>", methods=["DELETE"])
def deleteStudent(id):
    student = Students.query.filter_by(id=id).one()
    db.session.delete(student)
    db.session.commit()
    return f'Student (id: {id}) deleted!'
    # return render_template("index.html")

@app.route("/updatestudent")
def updatestudent():
    return render_template("update.html")

@app.route("/studentupdate/<id>", methods=["PUT"])
def updateStudent(id):
    student = Students.query.filter_by(id=id)
    sname = request.json['sname']
    branch = request.json['branch']
    college = request.json['college']
    student.update(dict(sname=sname, branch=branch, college=college))
    db.session.commit()
    # return student
    return format_student(student.one())
    
if __name__ == '__main__':
    db.create_all()
    app.run()