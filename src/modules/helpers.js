const beautifyDate = (d) => {
    const date = new Date(d);
    const year = new Intl.DateTimeFormat('ru-RU', { year: '2-digit' }).format(date);
    const month = new Intl.DateTimeFormat('ru-RU', { month: '2-digit' }).format(date);
    const day = new Intl.DateTimeFormat('ru-RU', { day: '2-digit' }).format(date);
    return `${day}.${month}.${year}`;
};

const beautifyDateTime = (d) => {
    const date = new Date(d);
    const year = new Intl.DateTimeFormat('ru-RU', { year: '2-digit' }).format(date);
    const month = new Intl.DateTimeFormat('ru-RU', { month: '2-digit' }).format(date);
    const day = new Intl.DateTimeFormat('ru-RU', { day: '2-digit' }).format(date);
    const hours = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit'}).format(date);
    const minutes = new Intl.DateTimeFormat('ru-RU', { minute: '2-digit'}).format(date);

    return `${day}.${month}.${year} ${hours}:${minutes}`;
};


export { beautifyDate, beautifyDateTime };