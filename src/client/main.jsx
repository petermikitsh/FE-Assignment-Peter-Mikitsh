import * as VDOM from "jsxProcessor";
import qs from "query-string";

const formatDecimalAsPercent = (decimal) => {
  return `${Number(decimal * 100).toFixed()}%`;
};

const App = ({ listData, detailData }) => {
  const header = detailData ? (
    <div style="margin-bottom: 16px;">
      <h1 style="margin-bottom: 0;">Exam {detailData.examId}</h1>
      <div>Average: {formatDecimalAsPercent(detailData.average)}</div>
    </div>
  ) : (
    <h1>All Exams</h1>
  );

  const table = detailData ? (
    <table style="width: 100%;">
      <tr style="border: 1px solid #000;">
        {["Student Name", "Grade", "Rank"].map((headerLabel) => (
          <th style="text-align: left;">{headerLabel}</th>
        ))}
      </tr>
      {detailData.results.map(({ studentId, score, rank }) => (
        <tr>
          <td>{studentId}</td>
          <td>{formatDecimalAsPercent(score)}</td>
          <td>{rank}</td>
        </tr>
      ))}
    </table>
  ) : (
    <table style="width: 100%;">
      <tr style="border: 1px solid #000;">
        {["Exam ID", "Avg Exam Grade", "Students"].map((headerLabel) => (
          <th style="text-align: left;">{headerLabel}</th>
        ))}
      </tr>
      {listData.exams.map(({ id, average, studentCount }) => {
        return (
          <tr>
            <td>
              <a href={`?examId=${id}`}>{id}</a>
            </td>
            <td>{formatDecimalAsPercent(average)}</td>
            <td>{studentCount}</td>
          </tr>
        );
      })}
    </table>
  );

  return (
    <div>
      <div style="height: 50px; border: 1px solid #000; display: flex; align-items: center; padding-left: 16px;">
        AcademicDataViewer v1.0
      </div>
      <div style="height: calc(100vh - 50px); display: flex;">
        <div style="width: 200px; height: 100%; border-right: 1px solid #000; display: flex; align-items: center; flex-direction: column;">
          <div style="display: flex; flex: 1; align-items: center;">Exams</div>
          <div style="display: flex; flex: 1; align-items: center;">
            Students
          </div>
        </div>
        <div style="flex: 1; padding: 16px; overflow-y: auto;">
          {header}
          {table}
        </div>
      </div>
    </div>
  );
};

const query = qs.parse(window.location.search);

if (!query.examId) {
  // List view
  window
    .fetch("/api/v1/exams")
    .then((res) => res.json())
    .then(({ exams }) => {
      const mountNode = document.createElement("div");
      document.body.appendChild(mountNode);
      VDOM.render(<App listData={{ exams }} />, mountNode);
    });
} else {
  // Detail view.
  window
    .fetch(`/api/v1/exams/${query.examId}`)
    .then((res) => res.json())
    .then(({ results, average }) => {
      const mountNode = document.createElement("div");
      document.body.appendChild(mountNode);

      const clonedResults = [...results];

      // Compute rank on a cloned array to maintain original ordering (per wireframe)
      clonedResults
        .sort((a, b) => {
          return b.score - a.score;
        })
        .map((result, index) => {
          result.rank = index + 1;
        });
      VDOM.render(
        <App detailData={{ examId: query.examId, results, average }} />,
        mountNode
      );
    });
}
