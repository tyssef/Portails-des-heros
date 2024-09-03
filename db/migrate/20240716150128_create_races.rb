class CreateRaces < ActiveRecord::Migration[7.1]
  def change
    create_table :races do |t|
      t.string :name
      t.references :universe, null: false, foreign_key: true

      t.timestamps
    end
  end
end
