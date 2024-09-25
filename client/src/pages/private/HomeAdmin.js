import React, { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import "chart.js";
import "jquery";
import { Bieudo, DailySchedule, DetailDaily,TodaySubject } from "../../components/admin";

const HomeAdmin = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectSession, setSelectedSubjects] = useState([]);

  const handleDateSelect = (date, sessions) => {
    // Chuyển đổi date thành đối tượng Date nếu cần
    const dateObj = new Date(date);

    // Nếu dateObj không hợp lệ, xử lý lỗi hoặc sử dụng giá trị mặc định
    if (isNaN(dateObj.getTime())) {
      console.error("Ngày không hợp lệ:", date);
      return;
    }

    setSelectedDate(dateObj.toISOString().split("T")[0]); // Chuyển đổi thành chuỗi ISO chỉ chứa ngày
    setSelectedSubjects(sessions);
  };

  useEffect(() => {
    // Khởi tạo biểu đồ khi component được mount
    var ctx = document.getElementById("myAreaChart");
    var myLineChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        datasets: [
          {
            label: "Earnings",
            lineTension: 0.3,
            backgroundColor: "rgba(78, 115, 223, 0.05)",
            borderColor: "rgba(78, 115, 223, 1)",
            pointRadius: 3,
            pointBackgroundColor: "rgba(78, 115, 223, 1)",
            pointBorderColor: "rgba(78, 115, 223, 1)",
            pointHoverRadius: 3,
            pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
            pointHoverBorderColor: "rgba(78, 115, 223, 1)",
            pointHitRadius: 10,
            pointBorderWidth: 2,
            data: [
              0,
              10000,
              5000,
              15000,
              10000,
              20000,
              15000,
              25000,
              20000,
              30000,
              25000,
              40000,
            ],
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: 10,
            right: 25,
            top: 25,
            bottom: 0,
          },
        },
        scales: {
          x: {
            time: {
              unit: "date",
            },
            grid: {
              display: false,
              drawBorder: false,
            },
            ticks: {
              maxTicksLimit: 7,
            },
          },
          y: {
            ticks: {
              maxTicksLimit: 5,
              padding: 10,
              callback: function (value, index, values) {
                return "$" + number_format(value);
              },
            },
            grid: {
              color: "rgb(234, 236, 244)",
              zeroLineColor: "rgb(234, 236, 244)",
              drawBorder: false,
              borderDash: [2],
              zeroLineBorderDash: [2],
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: "rgb(255,255,255)",
            bodyColor: "#858796",
            titleMarginBottom: 10,
            titleColor: "#6e707e",
            titleFontSize: 14,
            borderColor: "#dddfeb",
            borderWidth: 1,
            xPadding: 15,
            yPadding: 15,
            displayColors: false,
            intersect: false,
            mode: "index",
            caretPadding: 10,
            callbacks: {
              label: function (tooltipItem) {
                var datasetLabel = tooltipItem.dataset.label || "";
                return datasetLabel + ": $" + number_format(tooltipItem.raw);
              },
            },
          },
        },
      },
    });

    // Cleanup function để hủy biểu đồ khi component unmount
    return () => {
      if (myLineChart) {
        myLineChart.destroy();
      }
    };
  }, []);

  const number_format = (number, decimals, dec_point, thousands_sep) => {
    number = (number + "").replace(",", "").replace(" ", "");
    var n = !isFinite(+number) ? 0 : +number,
      prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
      sep = typeof thousands_sep === "undefined" ? "," : thousands_sep,
      dec = typeof dec_point === "undefined" ? "." : dec_point,
      s = "",
      toFixedFix = function (n, prec) {
        var k = Math.pow(10, prec);
        return "" + Math.round(n * k) / k;
      };
    s = (prec ? toFixedFix(n, prec) : "" + Math.round(n)).split(".");
    if (s[0].length > 3) {
      s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || "").length < prec) {
      s[1] = s[1] || "";
      s[1] += new Array(prec - s[1].length + 1).join("0");
    }
    return s.join(dec);
  };

  return (
    <div className="container-fluid">
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Dashboard</h1>
        <a
          href="#"
          className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
        >
          <i className="fas fa-download fa-sm text-white-50"></i> Generate
          Report
        </a>
      </div>
      <TodaySubject/>
      <div className="row">
        <div className="col-xl-8 col-lg-7">
          <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary">
                Earnings Overview
              </h6>
              <div className="dropdown no-arrow">
                <a
                  className="dropdown-toggle"
                  href="#"
                  role="button"
                  id="dropdownMenuLink"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <i className="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                </a>
                <div
                  className="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                  aria-labelledby="dropdownMenuLink"
                >
                  <div className="dropdown-header">Dropdown Header:</div>
                  <a className="dropdown-item" href="#">
                    Action
                  </a>
                  <a className="dropdown-item" href="#">
                    Another action
                  </a>
                  <div className="dropdown-divider"></div>
                  <a className="dropdown-item" href="#">
                    Something else here
                  </a>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="chart-area">
                <canvas id="myAreaChart"></canvas>
              </div>
            </div>
          </div>
        </div>
        <Bieudo />
      </div>
      <div className="row">
        {" "}
        <div className="col-xl-4 col-lg-5">
          <DetailDaily
            selectedDate={selectedDate}
            selectSession={selectSession}
          />
        </div>
        <div className="col-xl-8 col-lg-7">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Calendar</h6>
            </div>
            <DailySchedule onDateSelect={handleDateSelect} />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-6 mb-4">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Development</h6>
            </div>
            <div className="card-body">
              <h4 className="small font-weight-bold">Server Migration</h4>
              <p className="mb-4">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo
                adipisci voluptatem incidunt eos distinctio quibusdam sit
                suscipit nisi labore explicabo quod debitis facere atque libero
                nisi dolorum perspiciatis ipsam quas.
              </p>
              <h4 className="small font-weight-bold">Technology Stack</h4>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo
                adipisci voluptatem incidunt eos distinctio quibusdam sit
                suscipit nisi labore explicabo quod debitis facere atque libero
                nisi dolorum perspiciatis ipsam quas.
              </p>
            </div>
          </div>
        </div>
        <div className="col-lg-6 mb-4">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Frameworks</h6>
            </div>
            <div className="card-body">
              <h4 className="small font-weight-bold">Bootstrap</h4>
              <span className="float-right">Complete!</span>
              <div className="progress mb-4">
                <div
                  className="progress-bar bg-success"
                  role="progressbar"
                  style={{ width: "100%" }}
                  aria-valuenow="100"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
              <h4 className="small font-weight-bold">React</h4>
              <span className="float-right">50%</span>
              <div className="progress mb-4">
                <div
                  className="progress-bar bg-info"
                  role="progressbar"
                  style={{ width: "50%" }}
                  aria-valuenow="50"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
              <h4 className="small font-weight-bold">Vue</h4>
              <span className="float-right">25%</span>
              <div className="progress mb-4">
                <div
                  className="progress-bar bg-warning"
                  role="progressbar"
                  style={{ width: "25%" }}
                  aria-valuenow="25"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
              <h4 className="small font-weight-bold">Rails</h4>
              <span className="float-right">75%</span>
              <div className="progress mb-4">
                <div
                  className="progress-bar bg-danger"
                  role="progressbar"
                  style={{ width: "75%" }}
                  aria-valuenow="75"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
              <h4 className="small font-weight-bold">Laravel</h4>
              <span className="float-right">Complete!</span>
              <div className="progress mb-4">
                <div
                  className="progress-bar bg-success"
                  role="progressbar"
                  style={{ width: "100%" }}
                  aria-valuenow="100"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeAdmin;
