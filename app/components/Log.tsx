
export default function Log(){
    const eg=[
        {
            date:"2023/22/2 18:22:22",
            from:"njal",
            edit:["food","cabin"],
            cabin:"cabin"
        },
        {
            date:"2023/22/2 18:22:22",
            from:"njal",
            edit:["food","cabin"],
            cabin:"cabin"
        },
        {
            date:"2023/22/2 18:22:22",
            from:"njal",
            edit:["food","cabin"],
            cabin:"cabin"
        },
        {
            date:"2023/22/2 18:22:22",
            from:"njal",
            edit:["food","cabin"],
            cabin:"cabin"
        }
    ]
    return (
        <div className="w-4/12">
            {eg.map((item,index)=>{
                return(
                    <div key={`log-${index}`}>
                        <span>{item.date}</span>
                        <span>{item.from} updated {item.edit.join(",")} for {item.cabin} </span>
                    </div>
                )
            })}
        </div>
    )
}