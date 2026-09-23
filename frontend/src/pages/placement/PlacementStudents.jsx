/* eslint-disable react-hooks/immutability */
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getAllStudents,
} from "../../services/placementService";


const PlacementStudents = () => {
  const [students, setStudents] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [department, setDepartment] =
    useState("");

  const [year, setYear] =
    useState("");


  useEffect(() => {
    loadStudents();
  }, []);


  const loadStudents = async () => {
    try {
      setLoading(true);
      setMessage("");

      const data =
        await getAllStudents();

      const list =
        data.students ||
        data.data ||
        data ||
        [];

      setStudents(
        Array.isArray(list)
          ? list
          : []
      );
    } catch (error) {
      console.error(
        "Load students error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Failed to load students"
      );
    } finally {
      setLoading(false);
    }
  };


  const filteredStudents =
    useMemo(() => {
      return students.filter(
        (student) => {
          const name =
            student.userId?.name ||
            student.name ||
            "";

          const email =
            student.userId?.email ||
            student.email ||
            "";

          const studentId =
            student.studentId ||
            "";

          const studentDepartment =
            student.department ||
            "";

          const studentYear =
            String(
              student.year || ""
            );

          const searchValue =
            search
              .trim()
              .toLowerCase();


          const matchesSearch =
            !searchValue ||
            name
              .toLowerCase()
              .includes(
                searchValue
              ) ||
            email
              .toLowerCase()
              .includes(
                searchValue
              ) ||
            studentId
              .toLowerCase()
              .includes(
                searchValue
              );


          const matchesDepartment =
            !department ||
            studentDepartment ===
              department;


          const matchesYear =
            !year ||
            studentYear === year;


          return (
            matchesSearch &&
            matchesDepartment &&
            matchesYear
          );
        }
      );
    }, [
      students,
      search,
      department,
      year,
    ]);


  const departments =
    useMemo(() => {
      return [
        ...new Set(
          students
            .map(
              (student) =>
                student.department
            )
            .filter(Boolean)
        ),
      ];
    }, [students]);


  if (loading) {
    return (
      <div className="p-6">
        Loading students...
      </div>
    );
  }


  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="mb-6">

        <h1 className="text-3xl font-bold">
          Student Management
        </h1>

        <p className="mt-2 text-gray-500">
          View registered students and
          their academic details.
        </p>

      </div>


      {/* MESSAGE */}
      {message && (
        <div
          className="
            mb-6
            rounded-lg
            border
            border-red-200
            bg-red-50
            p-4
            text-red-700
          "
        >
          {message}
        </div>
      )}


      {/* SUMMARY */}
      <div
        className="
          mb-6
          grid
          grid-cols-1
          gap-4
          md:grid-cols-3
        "
      >

        <div
          className="
            rounded-xl
            border
            bg-white
            p-5
          "
        >
          <p className="text-gray-500">
            Total Students
          </p>

          <p className="mt-1 text-3xl font-bold">
            {students.length}
          </p>
        </div>


        <div
          className="
            rounded-xl
            border
            bg-white
            p-5
          "
        >
          <p className="text-gray-500">
            Showing
          </p>

          <p className="mt-1 text-3xl font-bold">
            {filteredStudents.length}
          </p>
        </div>


        <div
          className="
            rounded-xl
            border
            bg-white
            p-5
          "
        >
          <p className="text-gray-500">
            Departments
          </p>

          <p className="mt-1 text-3xl font-bold">
            {departments.length}
          </p>
        </div>

      </div>


      {/* FILTERS */}
      <div
        className="
          mb-6
          grid
          grid-cols-1
          gap-4
          rounded-xl
          border
          bg-white
          p-5
          md:grid-cols-3
        "
      >

        <input
          type="text"
          placeholder="Search by name, email or student ID"
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="
            rounded-lg
            border
            px-4
            py-2.5
            outline-none
            focus:ring-2
            focus:ring-black
          "
        />


        <select
          value={department}
          onChange={(e) =>
            setDepartment(
              e.target.value
            )
          }
          className="
            rounded-lg
            border
            px-4
            py-2.5
            outline-none
          "
        >
          <option value="">
            All Departments
          </option>

          {departments.map(
            (item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            )
          )}
        </select>


        <select
          value={year}
          onChange={(e) =>
            setYear(
              e.target.value
            )
          }
          className="
            rounded-lg
            border
            px-4
            py-2.5
            outline-none
          "
        >
          <option value="">
            All Years
          </option>

          <option value="1">
            First Year
          </option>

          <option value="2">
            Second Year
          </option>

          <option value="3">
            Third Year
          </option>

          <option value="4">
            Fourth Year
          </option>
        </select>

      </div>


      {/* STUDENT TABLE */}
      <div
        className="
          overflow-hidden
          rounded-xl
          border
          bg-white
        "
      >

        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead
              className="
                border-b
                bg-gray-50
              "
            >
              <tr>

                <th className="p-4">
                  Student
                </th>

                <th className="p-4">
                  Student ID
                </th>

                <th className="p-4">
                  Department
                </th>

                <th className="p-4">
                  Year
                </th>

                <th className="p-4">
                  CGPA
                </th>

                <th className="p-4">
                  Backlogs
                </th>

              </tr>
            </thead>


            <tbody>

              {filteredStudents.length ===
              0 ? (

                <tr>
                  <td
                    colSpan="6"
                    className="
                      p-10
                      text-center
                      text-gray-500
                    "
                  >
                    No students found.
                  </td>
                </tr>

              ) : (

                filteredStudents.map(
                  (student) => (

                    <tr
                      key={student._id}
                      className="
                        border-b
                        last:border-b-0
                        hover:bg-gray-50
                      "
                    >

                      {/* NAME */}
                      <td className="p-4">

                        <p className="font-semibold">
                          {student.userId
                            ?.name ||
                            student.name ||
                            "Student"}
                        </p>

                        <p
                          className="
                            mt-1
                            text-sm
                            text-gray-500
                          "
                        >
                          {student.userId
                            ?.email ||
                            student.email ||
                            "-"}
                        </p>

                      </td>


                      {/* STUDENT ID */}
                      <td className="p-4">

                        {student.studentId ||
                          "-"}

                      </td>


                      {/* DEPARTMENT */}
                      <td className="p-4">

                        {student.department ||
                          "-"}

                      </td>


                      {/* YEAR */}
                      <td className="p-4">

                        {student.year ||
                          "-"}

                      </td>


                      {/* CGPA */}
                      <td className="p-4">

                        {student.cgpa ??
                          "-"}

                      </td>


                      {/* BACKLOGS */}
                      <td className="p-4">

                        {student.backlogs ??
                          0}

                      </td>

                    </tr>
                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};


export default PlacementStudents;