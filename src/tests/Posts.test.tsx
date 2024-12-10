import "@testing-library/jest-dom"; // Ensure this import is included
import React from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import Posts from "../components/Posts";
import { CREATE_POST } from "../components/Queries";

// Mock the GraphQL query and mutation
const mocks = [
  {
    request: {
      query: CREATE_POST,
      variables: { title: "Test Title", body: "Test Body", userId: 1 },
    },
    result: {
      data: {
        createPost: {
          id: "1",
          title: "Test Title",
          body: "Test Body",
        },
      },
    },
  },
];

describe("Posts Component", () => {
  test("shows success modal when post is created successfully", async () => {
    // Render the Posts component wrapped with MockedProvider
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Posts userId={1} />
      </MockedProvider>
    );

    // Open the "Create Post" modal (button outside the modal)
    fireEvent.click(screen.getByText("Create Post"));

    // Fill in the title and body fields
    fireEvent.change(screen.getByPlaceholderText("Enter title"), {
      target: { value: "Test Title" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter content"), {
      target: { value: "Test Body" },
    });

    // Query for the modal dialog
    const modal = screen.getByRole('dialog');

    // Use `within` to restrict the query for the button inside the modal
    const modalSubmitButton = within(modal).getByRole('button', { name: /create post/i });
    fireEvent.click(modalSubmitButton);

    // Wait for the success notification modal to appear
    await waitFor(() => screen.getByText("Success"));

    // Check if the success notification modal is visible and contains the correct message
    expect(screen.getByText("Post created successfully!")).toBeInTheDocument();
  });
});
