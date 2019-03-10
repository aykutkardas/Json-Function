
import { where, logical } from './';

const data = [
    {
        userId: 1,
        id: 1,
        title: "Visit W3Schools!",
        completed: false,
        education: {
            isDone: true
        }
    },
    {
        userId: 2,
        id: 2,
        title: "quis ut nam facilis et officia qui",
        completed: false,
        education: {
            isDone: false
        }
    },
    {
        userId: 2,
        id: 3,
        title: "fugiat veniam minus",
        completed: false,
        education: {
            isDone: false
        }
    },
    {
        userId: 1,
        id: 4,
        title: "et porro tempora",
        completed: true
    }
];

console.log(where(data, [
    { id: logical('not in',[3,4])}
]));