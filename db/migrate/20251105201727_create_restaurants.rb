class CreateRestaurants < ActiveRecord::Migration[8.1]
  def change
    create_table :restaurants do |t|
      t.string :name
      t.string :cuisine
      t.string :address
      t.string :website
      t.float :latitude
      t.float :longitude
      t.boolean :user_added

      t.timestamps
    end
  end
end
