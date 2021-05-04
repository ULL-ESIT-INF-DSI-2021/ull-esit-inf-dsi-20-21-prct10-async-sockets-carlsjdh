import * as fs from 'fs';
import * as chalk from 'chalk';
import {NotesJson, ResponseType} from '../types';

/**
 * Clase Notes
 */
export class Notes {
  /**
   * Atributo notes :Notes
   */
  private static notes: Notes;

  /**
   * Constructor de la clase Notes vacío y privado
   */
  private constructor() {}

  /**
   * Obtienes el notes
   * @returns Devuelve el notes static
   */
  public static getNotes(): Notes {
    if (!fs.existsSync(`./notes`)) {
      fs.mkdirSync(`./notes`, {recursive: true});
    }
    if (!Notes.notes) {
      Notes.notes = new Notes();
    }
    return Notes.notes;
  };

  /**
   * AddNotes Agrega una nota
   * @param username Nombre de usuario
   * @param title Título de la nota
   * @param body Body de la nota
   * @param color Color de la nota
   */
  addNotes(username :string, title :string, body :string, color :string) {
    if ( ! this.checkColor(color) ) {
      const ResponseJson :ResponseType = {
        type: 'add',
        success: false,
        color: false,
      };
      console.log('Color not available');
      return JSON.stringify(ResponseJson);
    };

    // eslint-disable-next-line max-len
    const text = `{ "title": "${title}", "body": "${body}" , "color": "${color}" }`;

    if (fs.existsSync(`./notes/${username}`)) {
      if (!fs.existsSync(`./notes/${username}/${title}`)) {
        fs.writeFileSync(`./notes/${username}/${title}`, text);

        const NoteRespondJson :NotesJson = {
          user: `${username}`,
          title: `${title}`,
        };

        const ResponseJson :ResponseType = {
          type: 'add',
          success: true,
          notes: [NoteRespondJson],
          color: true,
        };

        console.log(`New note added!`);

        return JSON.stringify(ResponseJson);
      } else {
        const ResponseJson :ResponseType = {
          type: 'add',
          success: false,
          color: true,
        };

        console.log(`Note title taken!`);

        return JSON.stringify(ResponseJson);
      };
    } else {
      fs.mkdirSync(`./notes/${username}`, {recursive: true});
      fs.writeFileSync(`./notes/${username}/${title}`, text);

      const NoteRespondJson :NotesJson = {
        user: `${username}`,
        title: `${title}`,
      };

      const ResponseJson :ResponseType = {
        type: 'add',
        success: true,
        notes: [NoteRespondJson],
        color: true,
      };

      console.log(`New note added!`);

      return JSON.stringify(ResponseJson);
    }
  };

  /**
   * readNotes lee una nota
   * @param username Nombre de usuario
   * @param title Título de la nota
   * @returns Devuelve información de la nota
   */
  readNotes(username :string, title :string) {
    if (fs.existsSync(`./notes/${username}/${title}`)) {
      const data = fs.readFileSync(`./notes/${username}/${title}`);
      const JsonNote = JSON.parse(data.toString());
      this.consolelogColor(`${JsonNote.title}`, JsonNote.color, true);
      this.consolelogColor(`${JsonNote.body}`, JsonNote.color);

      const NoteRespondJson :NotesJson = {
        user: `${username}`,
        title: `${JsonNote.title}`,
        body: `${JsonNote.body}`,
        color: `${JsonNote.color}`,
      };

      const ResponseJson :ResponseType = {
        type: 'read',
        success: true,
        notes: [NoteRespondJson],
      };
      return JSON.stringify(ResponseJson);
    } else {
      const ResponseJson :ResponseType = {
        type: 'read',
        success: false,
      };
      console.log('Note not found');
      return JSON.stringify(ResponseJson);
    }
  }

  /**
   * listNotes lista las notas del usuario
   * @param username Nombre de usuario
   * @returns Devuelve las notas del usuario
   */
  listNotes(username :string) {
    if (fs.existsSync(`./notes/${username}`)) {
      console.log(chalk.white.inverse('Your notes:'));
      let list = '';
      fs.readdirSync(`./notes/${username}/`).forEach((note) => {
        const data = fs.readFileSync(`./notes/${username}/${note}`);
        const JsonNote = JSON.parse(data.toString());
        list = list + JsonNote.title + '\n';
        this.consolelogColor(`- ${JsonNote.title}`, JsonNote.color);
      });
      return list;
    } else {
      console.log(`That user doesn´t exist`);
      return 'User doesnt exist';
    }
  }

  /**
   * removeNote elimina la nota del usuario
   * @param username Nombre de usuario
   * @param title Título de la nota
   * @returns Devuelve el estado de si se elimina o no correctamente la nota
   */
  removeNote(username :string, title :string) {
    if (fs.existsSync(`./notes/${username}/${title}`)) {
      console.log('Note removed!');
      fs.rmSync(`./notes/${username}/${title}`);
      return `Note removed!`;
    } else {
      console.log(`No note found`);
      return `No note found`;
    }
  }

  /**
   * consolelogColor imprime el text con el color especificado
   * @param text Texto a imprimir
   * @param color Color a imprimir
   * @param inverse Invertir el color al imprimir
   */
  consolelogColor(text :string, color :string, inverse :boolean = false) {
    switch (color) {
      case 'blue':
        console.log(
          (inverse) ? chalk.blue.inverse(text) : chalk.blue(text),
        );
        break;
      case 'yellow':
        console.log(
          (inverse) ? chalk.yellow.inverse(text) : chalk.yellow(text),
        );
        break;
      case 'red':
        console.log(
          (inverse) ? chalk.red.inverse(text) : chalk.red(text),
        );
        break;
      case 'green':
        console.log(
          (inverse) ? chalk.green.inverse(text) : chalk.green(text),
        );
        break;
    }
  }

  /**
   * checkColor verifica si el color es válido
   * @param color Color
   * @returns Devuelve true si es válido
   */
  checkColor(color :string) {
    const bool = true;
    switch (color) {
      case 'blue':
        return bool;
      case 'yellow':
        return bool;
      case 'red':
        return bool;
      case 'green':
        return bool;
    }
    return false;
  }
};
