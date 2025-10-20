import {Model, DataTypes, Optional, Sequelize}from"sequelize"

interface UserAttributes{
   id:string;
   name:string;
   userName:string;
   password:string;
   role:string;
   phone:string;
   email?:string;
   community?:string;
   state?:string;
   isActive?:boolean;
   createdBy?:string;
   updatedBy?:string;
}
interface UserCreationAttributes extends Optional<UserAttributes,"id"> {}
export class User 
   extends Model<UserAttributes, UserCreationAttributes>
   implements UserAttributes{
         declare id:string;
         declare name:string;
         declare userName:string;
         declare password:string;
         declare role:string;
         declare phone:string;
         declare email?:string;
         declare community?:string;
         declare state?:string;
         declare isActive?:boolean;
         declare createdBy?:string;
         declare updatedBy?:string;
        
         // timestamps
         declare readonly createdAt:Date;
         declare readonly updatedAt:Date;
}

export const UserFactory=(sequelize:Sequelize)=>{
    return User.init({
         id:{
            type:DataTypes.UUID,
            defaultValue:DataTypes.UUIDV4,
            primaryKey:true,
            allowNull:false
         },
         name:{
            type:DataTypes.STRING,
            allowNull:false
         },
         userName:{
            type:DataTypes.STRING,
            allowNull:false
         },
         password:{
            type:DataTypes.STRING,
            allowNull:false,
            unique:true,
         },
         role:{
            type:DataTypes.STRING,
            allowNull:false,
            unique:false
         },
         phone:{
            type:DataTypes.STRING(20),
            allowNull:false,
            unique:true,
         },
         email:{
            type:DataTypes.STRING,
            allowNull:false,
            unique:true,
         },
         community:{
            type:DataTypes.STRING,
            allowNull:true,
         },
         state:{
            type:DataTypes.STRING,
            allowNull:true,
         },
        createdBy: {
           type: DataTypes.UUID,
           unique: false,
           allowNull: true,
        },
      updatedBy: {
         type: DataTypes.UUID,
         unique: false,
         allowNull: true,
      },
    },
    {
        tableName:"users",
        sequelize,
        timestamps:true
    }
         
    )
}