import { render, screen, fireEvent } from "@testing-library/react";
import { act } from "react";
import RestaurantCard from "../RestaurantCard";

const restaurant = {
  id: 1,
  name: "Bunsen",
  cuisine: "Burgers",
  address: "36 Wexford Street",
  website: "https://bunsen.ie",
  user_added: true,
};

describe("RestaurantCard", () => {
  it("shows restaurant info and user added badge", () => {
    render(
      <RestaurantCard
        restaurant={restaurant}
        onDelete={vi.fn()}
        onUpdate={vi.fn()}
      />,
    );

    expect(screen.getByText(restaurant.name)).toBeInTheDocument();
    expect(screen.getByText(/user added/i)).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes(restaurant.address))).toBeInTheDocument();
    expect(screen.getByRole("link", { name: restaurant.website })).toHaveAttribute(
      "href",
      restaurant.website,
    );
  });

  it("enters edit mode and saves changes", async () => {
    const onUpdate = vi.fn();
    render(
      <RestaurantCard
        restaurant={restaurant}
        onDelete={vi.fn()}
        onUpdate={onUpdate}
      />,
    );

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    });
    const nameInput = screen.getByLabelText(/name/i);

    await act(async () => {
      fireEvent.change(nameInput, { target: { value: "Updated Bunsen" } });
      fireEvent.click(screen.getByRole("button", { name: /save/i }));
    });

    expect(onUpdate).toHaveBeenCalledWith(restaurant.id, expect.objectContaining({
      name: "Updated Bunsen",
    }));
  });

  it("calls onDelete when delete clicked", () => {
    const onDelete = vi.fn();
    render(
      <RestaurantCard
        restaurant={restaurant}
        onDelete={onDelete}
        onUpdate={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /delete/i }));
    expect(onDelete).toHaveBeenCalledWith(restaurant.id);
  });
});
