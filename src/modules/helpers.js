const beautifyDate = (d) => {
    const date = new Date(d);
    const year = new Intl.DateTimeFormat('ru-RU', { year: '2-digit' }).format(date);
    const month = new Intl.DateTimeFormat('ru-RU', { month: '2-digit' }).format(date);
    const day = new Intl.DateTimeFormat('ru-RU', { day: '2-digit' }).format(date);
    return `${day}.${month}.${year}`;
};

export { beautifyDate };