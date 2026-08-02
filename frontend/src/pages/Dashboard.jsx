import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [skills, setSkills] = useState([]);
  const [atsScore, setAtsScore] = useState(0);
  const [history, setHistory] = useState([]);

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.log(error);
    }
  };

  const uploadResume = async () => {
    if (!file) {
      alert("Please select a resume first.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      alert(data.message);

      if (data.success) {
        setResumeText(data.text);
        setSkills(data.skills);
        setAtsScore(data.ats_score);

        setFile(null);

        loadHistory();
      }
    } catch (error) {
      console.log(error);
      alert("Cannot connect to FastAPI Server");
    }
  };

  const deleteResume = async (filename) => {
    const response = await fetch(
      "http://127.0.0.1:8000/delete_resume",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          filename,
        }),
      }
    );

    const data = await response.json();

    alert(data.message);

    loadHistory();
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}

      <div className="bg-blue-600 text-white p-5 flex justify-between items-center shadow">

        <div>
          <h1 className="text-3xl font-bold">
            AI Resume Analyzer
          </h1>

          <p className="mt-1">
            Welcome, {username}
          </p>
        </div>

        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-lg"
        >
          Logout
        </button>

      </div>

      <div className="max-w-6xl mx-auto p-8">

        {/* Upload Card */}

        <div className="bg-white rounded-xl shadow-lg p-8">

          <h2 className="text-3xl font-bold text-center mb-8">
            Upload Resume
          </h2>

          <input
            id="resume"
            type="file"
            accept=".pdf"
            hidden
            onChange={(e) => setFile(e.target.files[0])}
          />

          <label
            htmlFor="resume"
            className="block cursor-pointer border-2 border-dashed border-blue-400 rounded-xl bg-blue-50 hover:bg-blue-100 transition p-10 text-center"
          >

            {file ? (
              <>
                <div className="text-6xl">📄</div>

                <h2 className="text-2xl font-bold mt-4">
                  {file.name}
                </h2>

                <p className="text-green-600 mt-2">
                  Resume Selected Successfully
                </p>

                <p className="text-gray-500 mt-2">
                  Click again to choose another resume
                </p>
              </>
            ) : (
              <>
                <div className="text-6xl">📁</div>

                <h2 className="text-2xl font-bold mt-4">
                  Click here to Select Resume
                </h2>

                <p className="text-gray-500 mt-3">
                  Upload your PDF Resume
                </p>
              </>
            )}

          </label>

          <button
            onClick={uploadResume}
            className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white text-lg font-bold py-4 rounded-xl"
          >
            🚀 Analyze Resume
          </button>

        </div>

        {/* ATS */}

        {atsScore > 0 && (

          <div className="bg-white mt-8 rounded-xl shadow-lg p-8">

            <h2 className="text-2xl font-bold">
              ATS Score
            </h2>

            <div className="w-full bg-gray-300 rounded-full h-8 mt-5">

              <div
                className="bg-green-600 h-8 rounded-full text-white flex items-center justify-center font-bold"
                style={{
                  width: `${atsScore}%`,
                }}
              >
                {atsScore}%
              </div>

            </div>

          </div>

        )}

        {/* Skills */}

        {skills.length > 0 && (

          <div className="bg-white mt-8 rounded-xl shadow-lg p-8">

            <h2 className="text-2xl font-bold mb-5">
              Extracted Skills
            </h2>

            <div className="flex flex-wrap gap-3">

              {skills.map((skill, index) => (

                <span
                  key={index}
                  className="bg-green-100 text-green-700 px-4 py-2 rounded-full"
                >
                  {skill}
                </span>

              ))}

            </div>

          </div>

        )}

        {/* Resume Text */}

        {resumeText && (

          <div className="bg-white mt-8 rounded-xl shadow-lg p-8">

            <h2 className="text-2xl font-bold mb-5">
              Resume Text
            </h2>

            <textarea
              rows="18"
              value={resumeText}
              readOnly
              className="w-full border rounded-lg p-4"
            />

          </div>

        )}

        {/* History */}

        <div className="bg-white mt-8 rounded-xl shadow-lg p-8">

          <h2 className="text-2xl font-bold mb-6">
            Resume History
          </h2>

          {history.length === 0 ? (

            <p className="text-gray-500">
              No resumes uploaded yet.
            </p>

          ) : (

            history.map((resume, index) => (

              <div
                key={index}
                className="border rounded-lg p-5 mb-4 flex justify-between items-center"
              >

                <div>

                  <h3 className="font-bold text-lg">
                    📄 {resume.filename}
                  </h3>

                  <p>
                    ATS Score : {resume.ats_score}%
                  </p>

                  <p>
                    Uploaded : {resume.upload_time}
                  </p>

                </div>

                <button
                  onClick={() => deleteResume(resume.filename)}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
                >
                  Delete
                </button>

              </div>

            ))

          )}

        </div>

      </div>

    </div>
  );
}

export default Dashboard;