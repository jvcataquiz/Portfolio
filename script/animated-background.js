const canvas = document.getElementById('code-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Code snippets organized by language with their colors
const languages = [
    {
        name: 'javascript',
        color: '#8899aa',
        snippets: ['function', 'const', 'let', 'var', 'return', 'if', 'else', 'for', 'while', 'class', 'import', 'export', 'async', 'await', '=>', '===', '!==', 'console.log', 'document', 'window', 'setTimeout', 'Promise', 'map', 'filter', 'reduce', '{', '}', '(', ')', '[', ']', ';', 'true', 'false', 'null', 'undefined']
    },
    {
        name: 'python',
        color: '#7799bb',
        snippets: ['def', 'class', 'import', 'from', 'return', 'if', 'elif', 'else', 'for', 'while', 'in', 'not', 'and', 'or', 'True', 'False', 'None', 'print', 'range', 'len', 'list', 'dict', 'self', '__init__', 'lambda', 'with', 'try', 'except', 'finally', ':', 'pass', 'break']
    },
    {
        name: 'java',
        color: '#998888',
        snippets: ['public', 'private', 'protected', 'class', 'static', 'void', 'int', 'String', 'boolean', 'double', 'float', 'return', 'if', 'else', 'for', 'while', 'new', 'this', 'extends', 'implements', 'import', 'package', 'try', 'catch', 'finally', 'throw', 'throws', '{', '}', 'System.out', 'ArrayList', 'HashMap', 'abstract', 'interface']
    },
    {
        name: 'html',
        color: '#aa8899',
        snippets: ['<html>', '</html>', '<head>', '</head>', '<body>', '</body>', '<div>', '</div>', '<span>', '<p>', '<a>', '<img>', '<h1>', '<h2>', '<ul>', '<li>', '<table>', '<tr>', '<td>', '<form>', '<input>', 'class=', 'id=', 'src=', 'href=', 'style=', '<script>', '<link>', '<meta>', '<title>', '<nav>', '<header>', '<footer>', '<section>']
    },
    {
        name: 'css',
        color: '#88aa99',
        snippets: ['color:', 'background:', 'margin:', 'padding:', 'display:', 'flex', 'position:', 'absolute', 'relative', 'fixed', 'width:', 'height:', 'font-size:', 'font-family:', 'border:', 'border-radius:', '{', '}', '.class', '#id', 'hover', 'transition:', 'transform:', 'opacity:', 'z-index:', 'overflow:', 'grid', 'justify-content:', 'align-items:']
    },
    {
        name: 'cpp',
        color: '#7788aa',
        snippets: ['#include', 'int', 'void', 'char', 'float', 'double', 'bool', 'class', 'struct', 'public:', 'private:', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'namespace', 'using', 'std::', 'cout', 'cin', 'endl', 'new', 'delete', 'virtual', 'const', 'static', 'template', '{', '}', ';', '->']
    },
    {
        name: 'sql',
        color: '#889999',
        snippets: ['SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'JOIN', 'CREATE', 'TABLE', 'DROP', 'ALTER', 'INDEX', 'ORDER BY', 'GROUP BY', 'HAVING', 'COUNT', 'SUM', 'AVG']
    },
    {
        name: 'php',
        color: '#9988aa',
        snippets: ['<?php', '?>', 'echo', '$var', 'function', 'class', 'public', 'private', 'protected', 'require', 'include', 'namespace', 'use', 'trait']
    },
    {
        name: 'ruby',
        color: '#aa7788',
        snippets: ['def', 'end', 'class', 'module', 'require', 'puts', 'each', 'do', 'begin', 'rescue', 'ensure', 'yield', 'block']
    },
    {
        name: 'go',
        color: '#77aaaa',
        snippets: ['func', 'package', 'import', 'type', 'struct', 'interface', 'go', 'defer', 'chan', 'select', 'range', 'make', 'var']
    }
];

// Array to store active code snippets being typed
let activeSnippets = [];
let maxSnippets = 500; // Maximum number of snippets on screen at once

class CodeSnippet {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.lang = languages[Math.floor(Math.random() * languages.length)];
        this.fullText = this.lang.snippets[Math.floor(Math.random() * this.lang.snippets.length)];
        this.currentText = '';
        this.charIndex = 0;
        this.typingSpeed = Math.random() + 15; // Characters per second
        this.frameCounter = 0;
        this.framesPerChar = 30 / this.typingSpeed;
        this.isTyping = true;
        this.holdTime = 10 + Math.random() * 60; // Hold for 0.5-1.5 seconds after typing
        this.holdCounter = 0;
        this.fadeAlpha = 1;
        this.isFading = false;
    }

    update() {
        if (this.isTyping) {
            this.frameCounter++;
            if (this.frameCounter >= this.framesPerChar) {
                this.frameCounter = 0;
                if (this.charIndex < this.fullText.length) {
                    this.currentText += this.fullText[this.charIndex];
                    this.charIndex++;
                } else {
                    this.isTyping = false;
                }
            }
        } else if (!this.isFading) {
            this.holdCounter++;
            if (this.holdCounter >= this.holdTime) {
                this.isFading = true;
            }
        } else {
            this.fadeAlpha -= 0.02;
        }
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.fadeAlpha;
        ctx.font = '12px Courier New';
        ctx.fillStyle = this.lang.color;
        ctx.fillText(this.currentText, this.x, this.y);
        ctx.restore();
    }

    isDead() {
        return this.fadeAlpha <= 0;
    }
}

function spawnNewSnippet() {
    if (activeSnippets.length < maxSnippets && Math.random() < 0.15) {
        activeSnippets.push(new CodeSnippet());
    }
}

function draw() {
    // Fade background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw all active snippets
    for (let i = activeSnippets.length - 1; i >= 0; i--) {
        activeSnippets[i].update();
        activeSnippets[i].draw();

        // Remove dead snippets
        if (activeSnippets[i].isDead()) {
            activeSnippets.splice(i, 1);
        }
    }

    // Spawn new snippets
    spawnNewSnippet();
}

let lastTime = 0;
const fps = 30;
const interval = 1000 / fps;

function animate(currentTime) {
    requestAnimationFrame(animate);

    const deltaTime = currentTime - lastTime;

    if (deltaTime > interval) {
        lastTime = currentTime - (deltaTime % interval);
        draw();
    }
}

// Initialize with some snippets
for (let i = 0; i < 10; i++) {
    activeSnippets.push(new CodeSnippet());
}

animate(0);

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});