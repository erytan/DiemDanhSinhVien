import React, { useEffect, useState } from "react";
import { apiGetSession, apiUpdateUserSession } from "../../apis/session";
import { apiGetOneSubject } from "../../apis/subject";
import Chart from "chart.js/auto";
import moment from "moment";

const HomeAdmin = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);
  const [subjectSessionCount, setSubjectSessionCount] = useState({});

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await apiGetSession();
        if (response.session) {
          const today = moment().format("YYYY-MM-DD");

          // Fetch subject names and session counts
          const subjectResponses = await Promise.all(
            response.session.map((session) => apiGetOneSubject(session.subject))
          );

          const subjectCounts = subjectResponses.reduce((acc, response) => {
            const subjectId = response.data.id_subject;
            const countSession = response.data.countSession || 0;
            acc[subjectId] = countSession;
            return acc;
          }, {});

          const sessionsWithUpdatedDates = response.session.map((session) => {
            const sessionDate = moment(session.date);
            const countSession = subjectCounts[session.subject] || 0;
            const updatedDates = Array.from({ length: countSession }, (_, i) =>
              sessionDate
                .clone()
                .add(7 * i, "days")
                .format("YYYY-MM-DD")
            );

            return {
              ...session,
              originalDate: sessionDate.format("YYYY-MM-DD"),
              updatedDates,
            };
          });

          const filteredSessions = sessionsWithUpdatedDates.filter((session) =>
            session.updatedDates.includes(today)
          );

          // Aggregate sessions by subject name and count users with checkScanQR = true
          const newSubjectSessionCount = {};
          for (const session of filteredSessions) {
            const subjectResponse = await apiGetOneSubject(session.subject);
            const subjectName = subjectResponse.data.subjectname;

            const totalUsers = session.user.length;
            const checkedUsers = session.user.filter((user) => user.checkScanQR)
              .length;

            if (!newSubjectSessionCount[subjectName]) {
              newSubjectSessionCount[subjectName] = {
                total: totalUsers,
                checked: 0,
              };
            }
            newSubjectSessionCount[subjectName].checked += checkedUsers;
          }

          setSubjectSessionCount(newSubjectSessionCount);

          const labels = Object.keys(newSubjectSessionCount);
          const data = labels.map(
            (label) => newSubjectSessionCount[label].checked  || 0 
          );

          setChartData({
            labels,
            datasets: [
              {
                data,
                backgroundColor: ["#4e73df", "#1cc88a", "#36b9cc", "#1e90ff"],
                hoverBackgroundColor: [
                  "#2e59d9",
                  "#17a673",
                  "#2c9faf",
                  "#00bfff",
                ],
                hoverBorderColor: "rgba(234, 236, 244, 1)",
              },
            ],
          });
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching session data:", error);
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  useEffect(() => {
    const resetCheckScanQR = async () => {
      try {
        await apiUpdateUserSession();
        console.log("Đã reset checkScanQR cho tất cả người dùng");
      } catch (error) {
        console.error("Có lỗi xảy ra khi reset checkScanQR:", error);
      }
    };

    const now = new Date();
    const nextMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      0
    );
    const timeToNextMidnight = nextMidnight - now;

    const timerId = setTimeout(() => {
      resetCheckScanQR();
      // Lặp lại mỗi ngày
      setInterval(resetCheckScanQR, 24 * 60 * 60 * 1000); // 24 giờ
    }, timeToNextMidnight);

    return () => {
      clearTimeout(timerId);
    };
  }, []);
  const colors = ["#4e73df", "#1cc88a", "#36b9cc", "#1e90ff"]; // Mảng màu

  useEffect(() => {
    if (!loading && chartData.labels.length > 0) {
      const ctx = document.getElementById("myPieChart");
      const myPieChart = new Chart(ctx, {
        type: "doughnut",
        data: chartData,
        options: {
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              backgroundColor: "rgb(255,255,255)",
              bodyColor: "#858796",
              borderColor: "#dddfeb",
              borderWidth: 1,
              xPadding: 15,
              yPadding: 15,
              displayColors: false,
              caretPadding: 10,
            },
            legend: {
              display: false,
            },
          },
          cutout: "80%",
        },
      });

      return () => {
        if (myPieChart) {
          myPieChart.destroy();
        }
      };
    }
  }, [chartData, loading]);

  return (
    <div className="col-xl-4 col-lg-5">
      <div className="card shadow mb-4">
        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
          <h6 className="m-0 font-weight-bold text-primary">Revenue Sources</h6>
        </div>
        <div className="card-body">
          <div className="chart-pie pt-4">
            <canvas id="myPieChart"></canvas>
          </div>
          <div className="mt-4 text-center small">
            {chartData.labels.map((label, index) => (
              <span
                key={index}
                className="mr-2"
                style={{ color: colors[index % colors.length] }}
              >
                <i
                  className="fas fa-circle"
                  style={{ color: colors[index % colors.length] }}
                ></i>{" "}
                {label} ({subjectSessionCount[label]?.checked || 0}/
                {subjectSessionCount[label]?.total || 0})
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeAdmin;
