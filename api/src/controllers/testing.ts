// const myTest = (d) => {
//     const n1 = new Node(1, new Node(2, new Node(3, new Node(4, new Node(5, new Node(6, null))))))
//     // n1.print();
//     const swapped = swap(n1);
//     swapped.print();
//
// }
//
// export {myTest };
//
//
// const swap = (n:Node) => {
//     if (!n || !n.next) {
//         return n;
//     }
//     let h = n;
//     let t = n.next;
//     let remaining = t.next;
//
//     t.next = h;
//     h.next = swap(remaining);
//     return t;
// }

export class Node {
    constructor(public val: number, public next: Node = null) {};
    print = () => {
        console.log(this.val);
        if (this.next) {
            this.next.print();
        }
    }
}

const climbStairs = (n) => {
    if (n < 0 ) {
        return 0;
    } else if (n <= 3) {
        return n;
    } else {
        return climbStairs(n - 1) + climbStairs(n - 2);
    }
}

export {climbStairs, mergeTwoLists, kthGrammar, catalan};


const mergeTwoLists = (l1: Node, l2: Node) => {
    if (!l1 && !l2) {
        return null;
    }
    if (!l1) {
        return l2;
    }
    if (!l2) {
        return l1;
    }

    if (l1.val <= l2.val) {
        l1.next = mergeTwoLists(l1.next, l2);
        return l1;
    } else {
        l2.next = mergeTwoLists(l1, l2.next);
        return l2;
    }

}


const kthGrammar = (n, k): number[][] => {
    const res = [[]];
    kthGrammarUtil(n, 1, res);
    return res;

}

const kthGrammarUtil = (n: number, i: number, list: number[][]) => {
    if (i === 1) {
        list.push([0])
    }
    if (i > n) {
        return;
    }


    let temp = list[i - 1];
//    console.log(`temp`, temp);
    temp = temp.reduce((prev, cur) => {
        if (cur === 0) {
            prev.push(0);
            prev.push(1)
        } else {
            prev.push(1);
            prev.push(0);
        }
        return prev;
    }, []);
    temp.length > 0 && list.push(temp)

    kthGrammarUtil(n, i + 1, list);

}

class TreeNode {
    constructor(public val, public left?: TreeNode, public right?: TreeNode){}


    print = () => {
        const buffer = [];
        this.printHelper(buffer);
        console.log(buffer);
    }

    private printHelper = (buffer) => {
        if (this.left) {
            this.left.print();
        }
        buffer.push(this.val);
        if (this.right) {
            this.right.print();
        }
    }
}

export const generateTrees = n => {
    if (n <= 0) {
        return [];
    }
    return generateTreesUtil(1, n);
}

const generateTreesUtil = (m, n) => {
    let list: TreeNode[] = [];
    if (m > n) {
        list.push(new TreeNode(null));
        return list;
    }
    for (let i = m ; i <= n; i++) {
        let left: TreeNode[] = generateTreesUtil(m, i - 1);
        let right: TreeNode[] = generateTreesUtil(i +  1, n );
        left.forEach(l => {
            right.forEach(r => {
                let cur = new TreeNode(i);
                cur.left = l;
                cur.right = r;
                list.push(cur);
            })
        })

    }
    return list;
}

const catalan = (n) => {
    if (n <=1) {
        return 1;
    }
    let res = 0;
    for (let i = 0; i < n; i++) {
        res += catalan(i) * catalan(n-i-1);
    }
    return res;
}

export const pow = (x,n) => {
    if (n == 0) {
        return 1;
    } else {
        return x * pow(x, n - 1);
    }
}

export const walkingRobot = (obstacles: Array<Array<number>>, command: number[]) => {
    const left = -2;
    const right = -1;
    let position = {x: 0, y: 0};
    const dir = [[0,1], [1,0], [0, -1], [-1, 0]];
    let d = 0;
    command.forEach(c => {
        if (c === right) {
            d++;
            if (d === 4) {
                d = 0;
            }
        } else if (c === left) {
            d--;
            if (d === -1) {
                d = 3;
            }
        } else {
            position.x += dir[d][0] * c;
            position.y += dir[d][1] * c;
        }
    })
}
interface map<T> {
[key:string]: T
}
export function uncommonFromSentences(a: string, b: string) {
   let wordsInA = a.split(' ');
   let wordsInB = b.split(' ');
   let count = new Map<string, number>();

   let w = wordsInA.concat(wordsInB);
   console.log(`the concatenated:  ` + w);
   const words = w.filter(((word, index, array) => {
       return array.indexOf(word) === array.lastIndexOf(word)
   }));
   return words;

}
