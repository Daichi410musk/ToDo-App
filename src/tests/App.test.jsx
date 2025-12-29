import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("../../utils/supabaseFunctions", () => ({
  getAllTodos: jest.fn(() => Promise.resolve([])),
  addStudyRecord: jest.fn((content, time) =>
    Promise.resolve({
      id: Date.now(),
      title: content,
      time: time || 0,
    })
  ),
  deleteStudyRecord: jest.fn(),
}));

import App from "../App";

describe("App", () => {
  test("タイトルが表示されている", async () => {
    render(<App />);
    const title = await screen.findByRole("heading", { name: "学習記録一覧" });
    expect(title).toBeInTheDocument();
  });
  test("学習記録を追加することができる", async () => {
    render(<App />);
    const contentInput = await screen.findByRole("textbox");
    const timeInput = await screen.findByRole("spinbutton");
    const addButton = await screen.findByRole("button", { name: "登録" });
    fireEvent.change(contentInput, { target: { value: "テストタスク" } });
    fireEvent.change(timeInput, { target: { value: "1" } });
    fireEvent.click(addButton);
    const task = await screen.findByText(/テストタスク/);
    expect(task).toBeInTheDocument();
  });
  test("学習記録を削除することができる", async () => {
    render(<App />);
    const input = await screen.findByRole("textbox");
    const addButton = await screen.findByRole("button", { name: "登録" });
    fireEvent.change(input, { target: { value: "消えるタスク" } });
    fireEvent.click(addButton);
    const task = await screen.findByText(/消えるタスク/);
    expect(task).toBeInTheDocument();
    const deleteButton = await screen.findByRole("button", { name: "削除" });
    fireEvent.click(deleteButton);
    await waitFor(() => {
      const deletedTask = screen.queryByText(/消えるタスク/);
      expect(deletedTask).not.toBeInTheDocument();
    });
  });
  test("学習内容を入力せずに登録ボタンを押すとエラーメッセージが表示される", async () => {
    render(<App />);
    const registerButton = await screen.findByRole("button", { name: "登録" });
    fireEvent.click(registerButton);
    const errorMessage = await screen.findByText(/学習内容を入れてください/);
    expect(errorMessage).toBeInTheDocument();
  });
});
