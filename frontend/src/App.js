import {useEffect, useState} from 'react';
import axios from "axios";
// import ReactTable from "react-table";
import Button from 'react-bootstrap/Button';


import './App.css';

const baseUrl = "http://localhost:5000";


function App() {
  const [sname, setSname] = useState("");
  const [editSname, setEditSname] = useState("");
  const [branch, setBranch] = useState("");
  const [editBranch, setEditBranch] = useState("");
  const [college, setCollege] = useState("");
  const [editCollege, setEditCollege] = useState("");
  const [studentsList, setStudentsList] = useState([]);
  const [studentId, setStudentId] = useState(null);

  // console.log("studentslist type:", typeof(studentsList));

  const fetchStudents = async()=>{
    const data = await axios.get(`${baseUrl}/getstudentslist`);
    const { students } = data.data;
    setStudentsList(data.data);
    // console.log("Data:", data.data);
    // console.log("data type:", typeof(data.data));
    // console.log("Students list: ", studentsList);
  }

  useEffect(()=>{
    fetchStudents();
  }, [])

  const handleChange = (e, operation) =>{
    
    const target = e.target;
    const name = target.name;

    if (operation === 'edit'){
      if (name==="editSname"){
        setEditSname(e.target.value);
      }
      else if (name==="editBranch"){
        setEditBranch(e.target.value);
      }
      else if (name==="editCollege"){
        setEditCollege(e.target.value);
      }  
      // setEditSname(e.target.value);
      // setEditBranch(e.target.value);
      // setEditCollege(e.target.value);
    }else{
      if (name==="sname"){
        setSname(e.target.value);
      }
      else if (name==="branch"){
        setBranch(e.target.value);
      }
      else if (name==="college"){
        setCollege(e.target.value);
      }
    }
    
    // setSname(e.target.value);
    // setBranch(e.target.value);
    // setCollege(e.target.college);
  }

  const toggleEdit = (student) => {
    setStudentId(student.Id);
    setEditSname(student.Name);
    setEditBranch(student.Branch);
    setEditCollege(student.College);
  }

  const handleSubmit = async (e) =>{
    e.preventDefault();
    try{
      if (editSname || editBranch || editCollege){
        const data = await axios.put(`${baseUrl}/studentupdate/${studentId}`, {sname: editSname, branch: editBranch, college: editCollege});
        // if (editSname){
        //   const updatedSname = data.data.sname;
        // }
        // if (editBranch){
        //   const updatedBranch = data.data.branch;
        // }
        // if (editCollege){
        //   const updatedCollege = data.data.college;
        // }
        const updatedList = studentsList.map(student => {
          if (student.Id === studentId){
            // return student = {Name: updatedSname, Branch: updatedBranch, College: updatedCollege};
            return student=data.data;
          }
          return student;
        })
        setStudentsList(updatedList);
      }else{
        const data = await axios.post(`${baseUrl}/studentadd`, {sname, branch, college});
        setStudentsList([...studentsList, data.data]);
      }
      
      setSname("");
      setEditSname("");
      setBranch("");
      setEditBranch("");
      setCollege("");
      setEditCollege("");
      setStudentId(null);
    } catch(err){
      console.error(err.message);
    }
  }

  const handleDelete = async (id) => {
    try{
      await axios.delete(`${baseUrl}/deleteStudent/${id}`)
      const updatedList = studentsList.filter(student => student.id !== id);
      setStudentsList(updatedList);
    } catch (err){
      console.error(err.message);
    }
  }

  
  return (
    <div className="App">
      <section>
        <form onSubmit={handleSubmit}>
          <label htmlFor='sname'> Student Name</label>
          <input onChange={(e) => handleChange(e, 'insert')}
            type="text"
            name="sname"
            id="sname"
            value={sname}
          />
          {/* <br/> */}
          <label htmlFor='branch'> Branch</label>
          <input onChange={(e) => handleChange(e, 'insert')}
            type="text"
            name="branch"
            id="branch"
            value={branch}
          />
          {/* <br/> */}
          <label htmlFor='college'> College</label>
          <input onChange={(e) => handleChange(e, 'insert')}
            type="text"
            name="college"
            id="college"
            value={college}
          />
          {/* <br/> */}
          <center><button variant="primary" type="submit">Submit</button></center>
        </form>
      </section>
      <section>
        <ul>
          {
            studentsList.map(student=>{
              /*return (
                <li style={{display:"flex"}}key={student.Id}>
                {student.Name + " " + student.Branch + " " + student.College}
                <button onClick={()=>handleDelete(student.Name)}>X</button>
                </li>
              )*/
              if (studentId === student.Id){
                return(
                  <li>
                    <form onSubmit={handleSubmit} key={student.Id}>
                        
                        <input onChange={(e) => handleChange(e, 'edit')}
                          type="text"
                          name="editSname"
                          id="editSname"
                          value={editSname}
                        />

                        <input onChange={(e) => handleChange(e, 'edit')}
                          type="text"
                          name="editBranch"
                          id="editBranch"
                          value={editBranch}
                        />
                        
                        <input onChange={(e) => handleChange(e, 'edit')}
                          type="text"
                          name="editCollege"
                          id="editCollege"
                          value={editCollege}
                        />
                        <button type="submit">Submit</button>
                    </form>
                  </li>
                );
                
                
              }else{
                const data = studentsList;
                /* columns = [{
                  Header: "Name",
                  accessor: 'Name'
                },{
                  Header: "Branch",
                  accessor: 'Branch'
                },{
                  Header: "College",
                  accessor: "College"
                },{
                  Header: "Edit"
                },{
                  Header: "Delete"
                }
                ]; */
                return (
                  <div>
                  <table>
                    {/* <tr>
                      <th>Name</th>
                      <th>Branch</th>
                      <th>College</th>
                      <th>Edit</th>
                      <th>Delete</th>
                    </tr> */}
                    {/* {data.map((val, Id) => {
                      return (
                        <tr key={Id}>
                          <td>{val.Name}</td>
                          <td>{val.Branch}</td>
                          <td>{val.College}</td>
                          <td><button onClick={() => toggleEdit(student)}>Edit</button></td>
                          <td><button onClick={()=>handleDelete(student.Id)}>X</button></td>
                        </tr>
                      )
                    })} */}
                    <tr key={student.Id}>
                      <td>{student.Name}</td>
                      <td>{student.Branch}</td>
                      <td>{student.College}</td>
                      <td><button onClick={() => toggleEdit(student)}>Edit</button></td>
                      <td><button onClick={()=>handleDelete(student.Id)}>X</button></td>
                    </tr>
                  </table>
                  </div>
                  /* <li style={{display:"flex"}}key={student.Id}>
                  {student.Name + "-" + student.Branch + "-" + student.College}
                  <button onClick={() => toggleEdit(student)}>Edit</button>
                  <button onClick={()=>handleDelete(student.Id)}>X</button>
                  </li> */
                );
              }
            })
          }
        </ul>
      </section>
    </div>
  );
}

export default App;
