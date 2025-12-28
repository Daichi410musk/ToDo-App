import React, { useState, useEffect } from "react";
import {
  getAllTodos,
  addStudyRecord,
  deleteStudyRecord,
} from "../utils/supabaseFunctions";

function App() {
  const [records, setRecords] = useState([]);
  const [content, setContent] = useState("");
  const [time, setTime] = useState(0);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);

      const data = await getAllTodos();
      setRecords(data);

      setIsLoading(false);
    };

    fetchInitialData();
  }, []);

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <p>データを読み込み中...</p>
      </div>
    );
  }

  const resetRecords = () => {
    setContent("");
    setTime(0);
  };

  const register = async () => {
    if (content === "") {
      setError("学習内容を入れてください");
      return;
    }
    if (time === "") {
      setError("時間を入力してください");
      return;
    }

    try {
      const newRecord = await addStudyRecord(content, time);
      setError("");
      setRecords([...records, newRecord]);
      resetRecords();
    } catch {
      setError("データベースへの保存に失敗しました");
    }
  };

  const setDelete = async (id) => {
    try {
      await deleteStudyRecord(id);
      setRecords(records.filter((record) => record.id !== id));
    } catch {
      setError("データの削除に失敗しました");
    }
  };

  const totalTime = records.reduce((sum, current) => {
    return sum + parseInt(current.time);
  }, 0);

  return (
    <div>
      <h1>学習記録一覧</h1>

      <div>
        学習内容
        <input value={content} onChange={(e) => setContent(e.target.value)} />
      </div>
      <div>
        学習時間
        <input
          type="number"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        時間
      </div>
      <div>入力されている学習内容:{content}</div>
      <div>入力されている時間:{time}</div>
      {records.map((studyrecord) => (
        <div
          key={studyrecord.id}
          style={{ display: "flex", alignItems: "center" }}
        >
          <div>
            {studyrecord.title} {studyrecord.time}時間
          </div>
          <button
            onClick={() => setDelete(studyrecord.id)}
            style={{ marginLeft: "10px" }}
          >
            削除
          </button>
        </div>
      ))}
      <button
        onClick={() => {
          register();
        }}
      >
        登録
      </button>
      <div>{error}</div>
      <div>合計時間:{totalTime}/1000(h)</div>
    </div>
  );
}

export default App;
