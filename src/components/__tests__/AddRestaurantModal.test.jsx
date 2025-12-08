import { render, screen, fireEvent } from "@testing-library/react";
import AddRestaurantModal from "../AddRestaurantModal";

describe("AddRestaurantModal", () => {
  const baseProps = {
    show: true,
    onHide: vi.fn(),
    onSave: vi.fn(),
  };

  const fillForm = () => {
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Test Place" },
    });
    fireEvent.change(screen.getByLabelText(/cuisine/i), {
      target: { value: "Pizza" },
    });
    fireEvent.change(screen.getByLabelText(/address/i), {
      target: { value: "123 Main St" },
    });
    fireEvent.change(screen.getByLabelText(/website/i), {
      target: { value: "https://example.com" },
    });
    fireEvent.click(screen.getByLabelText(/mark as user added/i));
  };

  it("does not render when show is false", () => {
    render(<AddRestaurantModal {...baseProps} show={false} />);
    expect(screen.queryByText(/add new restaurant/i)).not.toBeInTheDocument();
  });

  it("submits form data and resets fields", () => {
    const onSave = vi.fn();
    render(<AddRestaurantModal {...baseProps} onSave={onSave} />);

    fillForm();
    fireEvent.submit(screen.getByTestId("add-restaurant-form"));

    expect(onSave).toHaveBeenCalledWith({
      name: "Test Place",
      cuisine: "Pizza",
      address: "123 Main St",
      website: "https://example.com",
      user_added: true,
    });

    // Inputs should be cleared after submit
    expect(screen.getByLabelText(/name/i)).toHaveValue("");
    expect(screen.getByLabelText(/cuisine/i)).toHaveValue("");
    expect(screen.getByLabelText(/address/i)).toHaveValue("");
    expect(screen.getByLabelText(/website/i)).toHaveValue("");
    expect(screen.getByLabelText(/mark as user added/i)).not.toBeChecked();
  });

  it("calls onHide when cancel/close is clicked", () => {
    const onHide = vi.fn();
    render(<AddRestaurantModal {...baseProps} onHide={onHide} />);

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onHide).toHaveBeenCalledTimes(1);
  });
});
