const calorieCalculateSchema

interface SchemaList{
    users{
        user_id:number,
        name:String,
        premium_flag:boolean,
        goalCalorie:number,
        goalCeight:number,
        favorite{
            menuId:number
        },
        records{
            Date{
                daily_weight:number,
                daily_menu{
                    time{
                        menuId:number
                        amount:number //inputGram / everyGram
                    }
                }
            }
        },
        originalMenu{
            menuId:number
            name:String
            category:String
            src:String
            everyCalorie:number
            everyGram:number
        }
    }

    menuInfo{
        menuId:number
        name:String
        category:String
        src:String
        everyCalorie:number
        everyGram:number
    }
    
}
