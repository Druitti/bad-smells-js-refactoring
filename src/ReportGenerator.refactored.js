
// ReportGenerator.refactored.js
export class ReportGenerator {
  constructor(database) {
    this.db = database;
  }

  generateReport(reportType, user, items) {
    let report = '';
    let total = 0;

    // Generate Header
    report += this.generateHeader(reportType, user);

    // Generate Body
    const { body, calculatedTotal } = this.generateBody(reportType, user, items);
    report += body;
    total += calculatedTotal;

    // Generate Footer
    report += this.generateFooter(reportType, total);

    return report.trim();
  }

  generateHeader(reportType, user) {
    if (reportType === 'CSV') {
      return 'ID,NOME,VALOR,USUARIO\n';
    } else if (reportType === 'HTML') {
      return `<html><body>\n<h1>Relatório</h1>\n<h2>Usuário: ${user.name}</h2>\n<table>\n<tr><th>ID</th><th>Nome</th><th>Valor</th></tr>\n`;
    }
    return '';
  }

  generateBody(reportType, user, items) {
    let body = '';
    let total = 0;

    for (const item of items) {
      if (this.shouldIncludeItem(user, item)) {
        const row = this.generateRow(reportType, item, user);
        body += row.content;
        total += row.value;
      }
    }

    return { body, calculatedTotal: total };
  }

  shouldIncludeItem(user, item) {
    return user.role === 'ADMIN' || (user.role === 'USER' && item.value <= 500);
  }

  generateRow(reportType, item, user) {
    const isPriority = item.value > 1000;
    const style = isPriority ? ' style="font-weight:bold;"' : '';

    if (reportType === 'CSV') {
      return { content: `${item.id},${item.name},${item.value},${user.name}\n`, value: item.value };
    } else if (reportType === 'HTML') {
      return { content: `<tr${style}><td>${item.id}</td><td>${item.name}</td><td>${item.value}</td></tr>\n`, value: item.value };
    }
    return { content: '', value: 0 };
  }

  generateFooter(reportType, total) {
    if (reportType === 'CSV') {
      return `\nTotal,,\n${total},,\n`;
    } else if (reportType === 'HTML') {
      return `</table>\n<h3>Total: ${total}</h3>\n</body></html>\n`;
    }
    return '';
  }
}