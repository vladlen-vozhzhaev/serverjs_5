const db = require('../config/db');

exports.showMainPage = async (req, res) => {
    const [result] = await db.query("SELECT * FROM articles");
    res.render('main_page', { articles: result });
}

exports.showSingleArticle = async (req, res)=>{
    const articleId = (req.params.id);
    const [result] = await db.query("SELECT * FROM articles WHERE id=?", [articleId]);
    res.render('single_article', {article: result[0]})
}

exports.showEditArticle = async (req, res)=>{
    const articleId = (req.params.id);
    const [result] = await db.query("SELECT * FROM articles WHERE id=?", [articleId]);
    res.render('edit_article', {article: result[0]})
};

exports.editArticle = async (req, res)=>{
    const { article_id, title, content} = req.body;
    const [result] = await db.execute("UPDATE articles SET title=?, content=? WHERE id = ?", [title, content, article_id]);
    res.redirect("/articles/"+result[0].id);
};

exports.deleteArticle = async (req, res)=>{
    const articleId = (req.params.id);
    const [result] = await db.execute("DELETE FROM articles WHERE id = ?", [articleId]);
    res.redirect("/");
};
exports.addArticle = async (req, res)=>{
    const { title, content, author } = req.body;
    await db.execute(`INSERT INTO articles (title, content, author) VALUES (?, ?, ?)`, [title, content, author]);
    res.redirect("/");
};