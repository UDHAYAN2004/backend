import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface FeedbackAttributes {
  id?: string;
  userId: string;
  message: string;
  rating?: number;
}

interface FeedbackCreationAttributes extends Optional<FeedbackAttributes, "id"> {}

export class Feedback
  extends Model<FeedbackAttributes, FeedbackCreationAttributes>
  implements FeedbackAttributes
{
  declare id: string;
  declare userId: string;
  declare message: string;
  declare rating?: number;

  // timestamps
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

export const FeedbackFactory = (sequelize: Sequelize) => {
  return Feedback.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 1,
          max: 5,
        },
      },
    },
    {
      tableName: "feedback",
      sequelize,
      timestamps: true,
    }
  );
};
