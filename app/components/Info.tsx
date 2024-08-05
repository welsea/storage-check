import React from "react";

function Info(props: any) {
    const { date } = props;
    return <table className="w-full text-center">
        <thead>
            <tr>
                <th>Date</th>
                <th>From</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>2024/12/23 20:00</td>
                <td>Njål</td>
            </tr>
        </tbody>
    </table>;
}

export default Info;
