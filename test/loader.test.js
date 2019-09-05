import compiler from "./compiler";
import path from 'path';

test('Inserts name and outputs JavaScript', async() => {
    const stats = await compiler('example.html', {name: 'Alice'});
    const output = stats.toJson().modules[0].source;
    console.log(output);
    expect(output).toBe('export default "<h1>Hello Alice!</h1>"');
});

test('With raw no export', async() => {
    //const output = stats.toJson().modules[0].source;
    //console.log(output);
    expect.assertions(1);
    await expect(compiler('example.html', {name: 'Alice', raw: true}))
        .rejects.toThrow(/You may need an additional loader.*<h1>Hello Alice!<\/h1>/s);
});

test('With lang', async() => {
    const stats = await compiler('example.html', {name: 'Alice', lang: 'cs'});
    const output = stats.toJson().modules[0].source;
    console.log(output);
    expect(output).toBe('export default "<h1>Hello Alenko!</h1>"');
});

test('With lang and includeFile', async() => {
    const stats = await compiler('example.html', {name: 'Alice', lang: 'cs',
        includeFile: path.join(__dirname, 'example.html')});
    const output = stats.toJson().modules[0].source;
    console.log(output);
    expect(output).toBe('export default "<h1>Hello Alenko!</h1>"');
});